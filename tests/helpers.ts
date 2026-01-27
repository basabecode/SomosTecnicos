import { Page } from '@playwright/test';

/**
 * Helper function to close the Terms and Conditions modal if it appears
 */
export async function closeTermsModalIfVisible(page: Page) {
  // Feature suspended
  return;
}

/**
 * Helper function to login as a user
 */
export async function login(page: Page, email: string, password: string, baseURL = 'http://localhost:3000') {
  await page.goto(`${baseURL}/login`);
  await page.getByLabel('Correo Electrónico').fill(email);
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

/**
 * Helper function to logout
 */
export async function logout(page: Page, baseURL = 'http://localhost:3000') {
  await page.goto(`${baseURL}/api/auth/logout`);
  await page.waitForTimeout(1000);
}
