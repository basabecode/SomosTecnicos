// scripts/optimizar_imagenes.mjs
import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");

// Buscar todos los archivos de manera recursiva (buscando en subcarpetas)
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Ignorar la carpeta de las imágenes que ya descartamos
      if (file !== "img-no-usadas") {
        getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(publicDir);

// Filtrar solo formatos pesados candidatos a conversión
const imageExtensionToConvert = [".jpg", ".jpeg", ".png", ".webp"];
const targetFiles = allFiles.filter((file) =>
  imageExtensionToConvert.includes(path.extname(file).toLowerCase())
);

async function optimizeImages() {
  process.stdout.write(`Encontradas ${targetFiles.length} imágenes para procesar...\n`);

  for (const inputPath of targetFiles) {
    const ext = path.extname(inputPath);
    // Parse path seguro que no borra puntos intermedios en el nombre
    const outputPath = inputPath.replace(new RegExp(`${ext}$`, "i"), ".avif");

    // Evitar reconvertir si ya existe la versión .avif
    if (fs.existsSync(outputPath) || inputPath.endsWith(".avif")) {
      continue;
    }

    try {
      await sharp(inputPath)
        // Redimensiona max. a 1200px. withoutEnlargement asegura que las imágenes
        // más pequeñas no se estíren ni se pixelen.
        .resize({ width: 1200, withoutEnlargement: true })
        // Calidad 60 es excelente balance entre ultra ligero y buena visualización en AVIF
        .avif({ quality: 60 })
        .toFile(outputPath);

      process.stdout.write(`✅ Convertido: ${path.basename(outputPath)}\n`);
    } catch (err) {
      process.stdout.write(`❌ Error al convertir ${inputPath}: ${err.message}\n`);
    }
  }
  process.stdout.write("¡Proceso de conversión AVIF completado!\n");
}

optimizeImages().catch(console.error);
