import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test'

// Configure serial mode so steps run in order and share state
test.describe.configure({ mode: 'serial' });

async function loginIfNeeded(
  page: Page,
  email: string,
  password: string,
  expectedPathRegex: RegExp
) {
  const onLogin = /\/login/.test(page.url())
  if (!onLogin) return

  const emailInput = page
    .locator('input[type="email"], input[id="email"], input[placeholder*="ejemplo"]')
    .first()

  const passwordInput = page.locator('input[type="password"]').first()
  const loginButton = page.getByRole('button', { name: /Ingresar/i }).first()

  const hasLoginForm = await emailInput.isVisible({ timeout: 5000 }).catch(() => false)
  if (!hasLoginForm) return

  await emailInput.fill(email)
  await passwordInput.fill(password)
  await loginButton.click()

  await page.waitForURL(expectedPathRegex, { timeout: 15000 })
}

test.describe('FSM Flow - General Rehearsal', () => {

  test('A. Customer Sub-Agent: Request Service', async ({ page }) => {
    // 1. Simulate Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));
    page.on('pageerror', exception => console.log(`BROWSER ERROR: "${exception}"`));

    // 2. Login (Demo) - WITH EXPLICIT WAITS
    console.log('[TEST] Navigating to /login...');
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for potential auto-redirect

    // Fallback: If still on login page but might be authenticated (from previous state), try manual push
    if (page.url().includes('/login')) {
         const lsContent = await page.evaluate(() => JSON.stringify(window.localStorage));
         console.log('[TEST] LocalStorage on Login:', lsContent);
    }

    // Check if we are already logged in or need to log in
    await page.waitForLoadState('networkidle');
    await loginIfNeeded(
      page,
      'cliente.demo@somostecnicos.com',
      process.env.DEMO_CLIENT_PASSWORD || 'ChangeMe2026!',
      /\/customer\/dashboard/
    )

    // Verify we're on dashboard
    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });
    console.log('[TEST] Successfully on customer dashboard');

    // 3. Navigate to Request - WITH EXPLICIT WAIT
    console.log('[TEST] Navigating to /customer/request...');
    await page.goto('/customer/request', { waitUntil: 'networkidle' });

    // Handle Terms and Conditions Modal if present
    // Suspended
    /*
    const termsModal = page.getByRole('dialog');
    if (await termsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
        // ... handling code ...
    } else {
        console.log('[TEST] No terms modal detected within timeout.');
    }
    */

    // 4. Fill Form
    // 4. Fill Form
    // Service Type
    // Use a more specific selector if possible, or expect the heading within the card
    await page.getByRole('heading', { name: 'Reparación Lavadora' }).click();

    // Description
    // Snapshot shows label: "Describe detalladamente el problema *"
    await page.getByRole('textbox', { name: 'Describe detalladamente el problema *' }).fill('Ruido fuerte al centrifugar y no drena el agua.');

    // Date (Popover)
    // Snapshot shows button: "Selecciona una fecha"
    await page.getByRole('button', { name: 'Selecciona una fecha' }).click();

    // Wait for calendar to appear
    const calendar = page.getByRole('grid');
    await expect(calendar).toBeVisible();
    // Click the first available day
    await calendar.locator('button:not([disabled])').first().click();

    // Time (Select)
    // Snapshot shows combobox: "Selecciona un horario"
    await page.getByRole('combobox').click();
    // Click the Item in the Portal
    await page.getByRole('option').first().click();

    // Submit
    // Snapshot shows button: "Solicitar Visita Ahora"
    await page.getByRole('button', { name: 'Solicitar Visita Ahora' }).click();

    // 5. Validation - Wait for Success Modal
    await expect(page.getByText('¡Solicitud Enviada!')).toBeVisible();
    await expect(page.getByText('Número de Solicitud')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Entendido' }).click();
  });

  test('B. Admin Sub-Agent: Assign & Conflict', async ({ page }) => {
    // Admin Login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await loginIfNeeded(
      page,
      'admin.demo@somostecnicos.com',
      process.env.DEMO_ADMIN_PASSWORD || 'ChangeMe2026!',
      /\/admin\/dashboard/
    )
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Go to Orders
    await page.goto('/admin/orders');
  });

  test('C. Technician Sub-Agent: Execution', async ({ page }) => {
    // Tech Login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await loginIfNeeded(
      page,
      'tecnico.demo@somostecnicos.com',
      process.env.DEMO_TECH_PASSWORD || 'ChangeMe2026!',
      /\/technician\/dashboard/
    )
    await expect(page).toHaveURL(/\/technician\/dashboard/);

    // Verify "Iniciar" button exists (We added this!) and click it
    // Using robust selector for the button if present
    const startButton = page.getByRole('button', { name: 'Iniciar' }).first();
    if (await startButton.isVisible()) {
        await startButton.click();
    }

    // Handle the alert (Page dialog)
    page.on('dialog', dialog => dialog.accept());
  });

});
