import { test, expect } from '@playwright/test';

test('Debug: Login and Navigate', async ({ page }) => {
  // Enable console logs
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('1. Going to login page...');
  await page.goto('http://localhost:3000/login');
  await page.screenshot({ path: 'debug-1-login.png' });

  console.log('2. Filling credentials...');
  await page.getByPlaceholder('m@example.com').fill('cliente.demo@tecnocity.com');
  await page.getByPlaceholder('******').fill('123456');
  await page.screenshot({ path: 'debug-2-filled.png' });

  console.log('3. Clicking login button...');
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  console.log('4. Waiting for navigation...');
  await page.waitForURL(/\/customer\/dashboard/, { timeout: 10000 });
  await page.screenshot({ path: 'debug-3-dashboard.png' });

  console.log('5. Checking localStorage...');
  const token = await page.evaluate(() => localStorage.getItem('accessToken'));
  console.log('Token exists:', !!token);

  console.log('6. Going to request page...');
  await page.goto('http://localhost:3000/customer/request');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'debug-4-request.png' });

  console.log('7. Checking page content...');
  const pageTitle = await page.textContent('h1');
  console.log('Page title:', pageTitle);

  console.log('✅ Test completed successfully!');
});
