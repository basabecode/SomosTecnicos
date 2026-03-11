import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const targetDir = path.join(publicDir, 'img-no-usadas');

const imgExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const ignoreDirs = ['node_modules', '.next', '.git', 'playwright-report', 'test-results', 'prisma', 'img-no-usadas', '.gemini', '.claude'];
const ignoreExtsForReading = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp', '.pdf', '.exe', '.zip', '.tar', '.gz'];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignoreDirs.includes(file)) continue;

    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    // Check if it is a directory
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    } catch (e) {
      // Ignore errors like permission denied
    }
  }
  return fileList;
}

const allProjectFiles = getAllFiles(rootDir);

const imageFiles = allProjectFiles.filter(file => {
  if (!file.startsWith(publicDir)) return false;
  const ext = path.extname(file).toLowerCase();
  return imgExtensions.includes(ext);
});

const sourceFiles = allProjectFiles.filter(file => {
  if (file.startsWith(publicDir)) return false;
  if (path.basename(file) === 'test.html') return false;
  const ext = path.extname(file).toLowerCase();
  return !ignoreExtsForReading.includes(ext);
});

console.log(`Reading ${sourceFiles.length} source files...`);

let sourceContents = '';
for (const file of sourceFiles) {
  try {
    sourceContents += fs.readFileSync(file, 'utf8') + '\n';
  } catch(e) {
    // skip
  }
}

const missing = [];
const used = [];

for (const img of imageFiles) {
  const base = path.basename(img);
  const ext = path.extname(img).toLowerCase();
  
  if (['favicon.ico', 'icon.png', 'apple-icon.png', 'opengraph-image.png', 'twitter-image.png'].includes(base.toLowerCase())) {
     used.push(img);
     continue;
  }
  
  const baseEncoded = encodeURIComponent(base);
  const relPath = path.relative(publicDir, img).replace(/\\/g, '/');
  const baseRelEncoded = encodeURIComponent(relPath);
  const relPathSpaceToPercent20 = relPath.replace(/ /g, '%20');
  
  let isUsed = sourceContents.includes(base) || 
               sourceContents.includes(baseEncoded) || 
               sourceContents.includes(relPath) || 
               sourceContents.includes(baseRelEncoded) ||
               sourceContents.includes(relPathSpaceToPercent20);
               
  if (isUsed) {
    used.push(img);
  } else {
    missing.push(img);
  }
}

console.log(`Found ${imageFiles.length} total image files in public/`);
console.log(`Used: ${used.length}`);
console.log(`Unused: ${missing.length}`);

for (const img of missing) {
  const base = path.basename(img);
  let targetPath = path.join(targetDir, base);
  let counter = 1;
  while (fs.existsSync(targetPath)) {
    const nameStr = path.basename(base, ext);
    targetPath = path.join(targetDir, `${nameStr}_${counter}${ext}`);
    counter++;
  }
  
  try {
    fs.renameSync(img, targetPath);
    console.log(`Moved ${base}`);
  } catch (err) {
    console.error(`Failed to move ${img}: ${err.message}`);
  }
}
