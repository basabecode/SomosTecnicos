import { test, expect } from '@playwright/test'

type Group = {
  portal: 'admin' | 'customer' | 'technician'
  role: 'admin' | 'customer' | 'technician'
  routes: string[]
}

const groups: Group[] = [
  {
    portal: 'admin',
    role: 'admin',
    routes: [
      '/admin/dashboard',
      '/admin/messages',
      '/admin/orders',
      '/admin/customers',
      '/admin/technicians',
      '/admin/applications',
      '/admin/reports',
      '/admin/settings',
    ],
  },
  {
    portal: 'customer',
    role: 'customer',
    routes: [
      '/customer/dashboard',
      '/customer/services',
      '/customer/request',
      '/customer/history',
      '/customer/warranty',
      '/customer/messages',
      '/customer/profile',
      '/customer/settings',
    ],
  },
  {
    portal: 'technician',
    role: 'technician',
    routes: [
      '/technician/dashboard',
      '/technician/assignments',
      '/technician/messages',
      '/technician/schedule',
      '/technician/history',
      '/technician/settings',
    ],
  },
]

const markerPatterns = [
  /este m[oó]dulo .* en desarrollo/i,
  /\bpr[oó]ximamente\b/i,
  /datos de ejemplo/i,
  /under construction/i,
  /this page could not be found/i,
]

for (const group of groups) {
  test.describe(`Sidebar audit - ${group.portal}`, () => {
    test.use({
      extraHTTPHeaders: {
        'x-test-bypass': '1',
        'x-test-role': group.role,
      },
    })

    for (const route of group.routes) {
      test(`${route} carga y sin señales de stub visible`, async ({ page }) => {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
        expect(response).not.toBeNull()
        expect(response!.status()).toBeLessThan(400)

        const body = page.locator('body')
        await expect(body).toBeVisible()

        const text = (await body.innerText()).toLowerCase()
        for (const pattern of markerPatterns) {
          expect(
            pattern.test(text),
            `Marker "${pattern}" detectado en ${route}`
          ).toBeFalsy()
        }
      })
    }
  })
}
