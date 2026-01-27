import { test, expect, Page } from '@playwright/test';
import { setupApiMocks, MOCK_TECH, MOCK_ADMIN, clearSessionMessages } from './helpers/api-mocks';

test.describe('Chat System Verification: Tech <-> Admin (Mocked)', () => {
  const PASSWORD = '123456';
  const MSG_CONTENT = `Test Message ${Date.now()}`;
  const REPLY_CONTENT = `Admin Reply ${Date.now()}`;

  test.beforeEach(() => {
    clearSessionMessages();
  });

  // Helper to bypass login UI
  const bypassLogin = async (page: Page, user: typeof MOCK_TECH, baseURL: string) => {
    console.log(`🔹 Bypassing UI Login for ${user.role}...`);
    await page.goto(`${baseURL}/login`);

    await page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('terms_accepted', 'true'); // Try to bypass terms modal
    }, 'mock-access-token');

    await page.context().addCookies([
      { name: 'auth-token', value: 'mock-access-token', domain: 'localhost', path: '/' },
      { name: 'refreshToken', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
    ]);

    console.log(`🔹 Navigating to ${user.role} messages page...`);
    const targetUrl = user.role === 'admin' ? `${baseURL}/admin/messages` : `${baseURL}/technician/messages`;
    await page.goto(targetUrl);

    // Explicit waits for React initialization
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  };

  test('Should handle Tech to Admin communication flow correctly with Mocks', async ({ page }) => {
    test.setTimeout(180000);
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';

    // ----------------------------------------------------
    // DEBUGGING LISTENERS
    // ----------------------------------------------------
    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });

    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        console.log('❌ CONSOLE ERROR:', text);
      } else if (text.includes('MOCK') || text.includes('API')) {
        console.log(`[BROWSER-LOG] ${text}`);
      }
    });

    // ----------------------------------------------------
    // PHASE 1: TECHNICIAN SENDS MESSAGE
    // ----------------------------------------------------
    console.log('🔹 PHASE 1: Technician sending message...');
    await setupApiMocks(page, MOCK_TECH);

    await bypassLogin(page, MOCK_TECH, baseURL);

    // Wait for messages header to ensure page is loaded
    await page.getByText('Mis Mensajes').waitFor({ state: 'visible', timeout: 20000 });

    // Debug screenshot
    await page.screenshot({ path: 'tests/screenshots/tech-messages-loaded.png', fullPage: true });

    // Wait for messages UI button
    console.log('🔹 Waiting for Nuevo Mensaje button...');
    const newMsgBtn = page.getByRole('button', { name: /Nuevo Mensaje/i });
    await expect(newMsgBtn).toBeVisible({ timeout: 15000 });
    console.log('🔹 Clicking Nuevo Mensaje button...');
    await newMsgBtn.click();

    // Verify dialog is open
    console.log('🔹 Verifying Dialog is open...');
    await expect(page.getByRole('dialog')).toBeVisible();

    // Select recipient: Soporte
    console.log('🔹 Opening select trigger for Tipo...');
    const tipoTrigger = page.getByRole('combobox').filter({ hasText: /Seleccionar/i });
    await tipoTrigger.click();

    console.log('🔹 Selecting Administration/Support option...');
    const supportOption = page.getByRole('option', { name: /Administración/i });
    await supportOption.waitFor({ state: 'visible' });
    await supportOption.click();

    console.log('🔹 Filling message details...');
    await page.getByPlaceholder(/Dudas sobre la reparación/i).fill('Support Help');
    await page.getByPlaceholder(/Escribe tu mensaje aquí/i).fill(MSG_CONTENT);

    console.log('🔹 Clicking Send Message...');
    await page.getByRole('button', { name: /Enviar Mensaje/i }).click();

    // Verify it appears in the technician list
    console.log('🔹 Verifying message appeared in list...');
    await expect(page.getByText(MSG_CONTENT).first()).toBeVisible({ timeout: 15000 });

    // ----------------------------------------------------
    // PHASE 2: ADMIN RECEIVES & REPLIES
    // ----------------------------------------------------
    console.log('🔹 PHASE 2: Admin receiving and replying...');

    // Reset mocks for Admin user
    await setupApiMocks(page, MOCK_ADMIN);

    await bypassLogin(page, MOCK_ADMIN, baseURL);

    // Verify admin inbox header
    await page.getByText('Tus Mensajes').waitFor({ state: 'visible', timeout: 15000 });

    // Find the message from Carlos Mendoza (MOCK_TECH)
    console.log('🔹 Finding/Clicking initial message thread...');
    await page.getByText(MSG_CONTENT).first().click();

    // Verify Technician name is visible in the chat header or list
    console.log('🔹 Verifying tech name visible...');
    await expect(page.getByText(MOCK_TECH.nombre)).toBeVisible();

    // Reply
    console.log('🔹 Filling reply...');
    await page.getByPlaceholder(/Escribe un mensaje/i).fill(REPLY_CONTENT);

    console.log('🔹 Clicking Enviar (Reply)...');
    const sendBtn = page.getByRole('button').filter({ has: page.locator('svg') }).or(page.getByRole('button', { name: /Enviar/i }));
    await sendBtn.first().click();

    console.log('🔹 Waiting for reply to register...');
    await page.waitForTimeout(2000);

    // ----------------------------------------------------
    // PHASE 3: TECHNICIAN SEES REPLY
    // ----------------------------------------------------
    console.log('🔹 PHASE 3: Technician checking reply...');

    await setupApiMocks(page, MOCK_TECH);

    await bypassLogin(page, MOCK_TECH, baseURL);

    console.log('🔹 Clicking reply content in list...');
    await page.getByText(REPLY_CONTENT).first().click();

    // Verify Admin name is shown as sender
    console.log('🔹 Verifying admin name visible in chat...');
    await expect(page.getByText(MOCK_ADMIN.nombre)).toBeVisible();

    console.log('✅ Cycle Complete with Mocks');
  });
});
