import { test, expect, APIRequestContext, Page } from '@playwright/test'

type Role = 'admin' | 'customer' | 'technician'

const NOT_FOUND_TEXTS = [
  'This page could not be found',
  '404',
  'No encontrado',
]

async function assertNo404(page: Page) {
  for (const text of NOT_FOUND_TEXTS) {
    const count = await page.getByText(text, { exact: false }).count()
    expect(count, `Se detectó texto de 404: ${text}`).toBe(0)
  }
}

async function openAndCheck(page: Page, path: string, retries = 1) {
  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await page.goto(path, {
        waitUntil: 'domcontentloaded',
        timeout: 90000,
      })
      expect(response, `No hubo respuesta navegando a ${path}`).not.toBeNull()
      expect(response!.status(), `HTTP inesperado en ${path}`).toBeLessThan(400)
      await expect(page.locator('body')).toBeVisible({ timeout: 15000 })
      await assertNo404(page)
      return
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        await page.waitForTimeout(1500)
      }
    }
  }

  throw lastError
}

function bypassHeaders(role: Role) {
  return {
    'x-test-bypass': '1',
    'x-test-role': role,
  }
}

async function getDynamicIds(request: APIRequestContext) {
  const [ordersRes, techniciansRes] = await Promise.all([
    request.get('/api/orders?limit=1'),
    request.get('/api/technicians?limit=1'),
  ])

  let orderId: string | null = null
  let technicianId: number | null = null

  if (ordersRes.ok()) {
    const data = await ordersRes.json()
    orderId = data?.data?.orders?.[0]?.id ?? null
  }

  if (techniciansRes.ok()) {
    const data = await techniciansRes.json()
    technicianId = data?.data?.technicians?.[0]?.id ?? null
  }

  return { orderId, technicianId }
}

test.describe('Functional Smoke - Admin Portal', () => {
  test.setTimeout(180000)
  test.use({ extraHTTPHeaders: bypassHeaders('admin') })

  test('admin rutas críticas y rutas dinámicas', async ({ page, request }) => {
    const staticRoutes = [
      '/admin/dashboard',
      '/admin/orders',
      '/admin/orders/create',
      '/admin/technicians',
      '/admin/customers',
      '/admin/messages',
      '/admin/applications',
      '/admin/assignments',
      '/admin/reports',
      '/admin/settings',
      '/admin/profile',
    ]

    for (const route of staticRoutes) {
      await openAndCheck(page, route)
    }

    const { orderId, technicianId } = await getDynamicIds(request)

    if (orderId) {
      await openAndCheck(page, `/admin/orders/${orderId}`)
      await openAndCheck(page, `/admin/orders/${orderId}/edit`)
      await openAndCheck(page, `/admin/orders/${orderId}/assign`)
    }

    if (technicianId) {
      await openAndCheck(page, `/admin/technicians/${technicianId}`)
      await openAndCheck(page, `/admin/technicians/${technicianId}/edit`)
    }
  })
})

test.describe('Functional Smoke - Customer Portal', () => {
  test.setTimeout(120000)
  test.use({ extraHTTPHeaders: bypassHeaders('customer') })

  test('cliente rutas críticas', async ({ page }) => {
    const routes = [
      '/customer/dashboard',
      '/customer/request',
      '/customer/history',
      '/customer/messages',
      '/customer/notifications',
      '/customer/profile',
      '/customer/services',
      '/customer/warranty',
      '/customer/settings',
    ]

    for (const route of routes) {
      await openAndCheck(page, route)
    }
  })
})

test.describe('Functional Smoke - Technician Portal', () => {
  test.setTimeout(120000)
  test.use({ extraHTTPHeaders: bypassHeaders('technician') })

  test('técnico rutas críticas', async ({ page }) => {
    const routes = [
      '/technician/dashboard',
      '/technician/assignments',
      '/technician/history',
      '/technician/messages',
      '/technician/notifications',
      '/technician/schedule',
      '/technician/settings',
    ]

    for (const route of routes) {
      await openAndCheck(page, route)
    }
  })
})
