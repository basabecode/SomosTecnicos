import { Page } from '@playwright/test';

export interface MockUser {
  id: string;
  email: string;
  nombre: string;
  role: string;
  userType: string;
}

export const MOCK_TECH: MockUser = {
  id: '2',
  email: 'tecnico.demo@somostecnicos.com',
  nombre: 'Carlos Mendoza',
  role: 'technician',
  userType: 'admin_user'
};

export const MOCK_ADMIN: MockUser = {
  id: '1',
  email: 'admin.demo@somostecnicos.com',
  nombre: 'Administrador Principal',
  role: 'admin',
  userType: 'admin_user'
};

// Shared state for the session
let sessionMessages: any[] = [];
let currentUser: MockUser | null = null;

export function clearSessionMessages() {
  sessionMessages = [];
}

export function setCurrentUser(user: MockUser) {
  currentUser = user;
}

/**
 * Sets up global API mocks for the application
 */
export async function setupApiMocks(page: Page, initialUser?: MockUser) {
  if (initialUser) {
    currentUser = initialUser;
  }

  console.log(`[MOCK] Configuring detailed dynamic mocks...`);

  // 0. Auth Logout Mock
  await page.route('**/api/auth/logout*', async (route) => {
    console.log(`[MOCK] Intercepted ${route.request().method()} /api/auth/logout`);
    currentUser = null;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Logout exitoso' })
    });
  });

  // 1. Auth Login Mock
  await page.route('**/api/auth/login', async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      console.log(`[MOCK] Intercepted POST /api/auth/login for ${body.email}`);

      if (body.email === MOCK_ADMIN.email) currentUser = MOCK_ADMIN;
      else if (body.email === MOCK_TECH.email) currentUser = MOCK_TECH;

      if (!currentUser) {
          return route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, error: 'Credenciales inválidas' })
          });
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login exitoso',
          user: {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.email.split('@')[0],
            nombre: currentUser.nombre,
            role: currentUser.role,
            activo: true
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '24h'
        })
      });
    } else {
      route.continue();
    }
  });

  // 2. Auth Me Mock
  await page.route('**/api/auth/me', async (route) => {
    if (!currentUser) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'No autorizado' })
        });
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: currentUser.id,
          username: currentUser.email.split('@')[0],
          email: currentUser.email,
          nombre: currentUser.nombre,
          apellido: 'Demo',
          telefono: '123456789',
          role: currentUser.role,
          userType: 'admin_user',
          activo: true
        }
      })
    });
  });

  // 3. Notifications Mock
  await page.route('**/api/notifications*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            notifications: [],
            unreadCount: 0
          }
        })
      });
    } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
    }
  });

  // 4. Assignments Mock
  await page.route('**/api/technicians/me/assignments*', async (route) => {
    if (!currentUser || currentUser.role !== 'technician') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, assignments: [] })
        });
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        technician: {
          id: parseInt(currentUser.id),
          nombre: currentUser.nombre,
          especialidades: ['Reparación'],
          zona: 'Lima'
        },
        assignments: [],
        stats: { pending: 0, inProgress: 0, completedToday: 0 }
      })
    });
  });

  // 5. Messages Mock (GET and POST)
  await page.route('**/api/messages**', async (route) => {
    const method = route.request().method();
    const user = currentUser;

    if (method === 'GET') {
      if (!user) return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, messages: [] })
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          messages: sessionMessages.filter(m =>
              (m.senderId?.toString() === user.id?.toString()) ||
              (m.receiverId?.toString() === user.id?.toString()) ||
              (user.role === 'admin' && (m.receiverType === 'support' || m.receiverType === 'admin'))
          )
        })
      });
    } else if (method === 'POST') {
      if (!user) return route.fulfill({ status: 401 });

      const postData = route.request().postDataJSON();
      const newMsg = {
        id: `msg-${Date.now()}`,
        ...postData,
        senderId: user.id,
        senderType: user.role === 'technician' ? 'technician' : 'admin',
        senderName: user.nombre,
        createdAt: new Date().toISOString(),
        from: { name: user.nombre, role: user.role, id: user.id },
        to: { role: postData.receiverType || 'support', id: postData.receiverId || '0' },
        read: false
      };

      sessionMessages.unshift(newMsg);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: newMsg
        })
      });
    } else {
      route.continue();
    }
  });

  // 6. Orders Mock
  await page.route('**/api/orders**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        orders: [],
        data: { orders: [] }
      })
    });
  });

  // 7. Generic Fallback
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    // Endpoints already handled
    const handled = ['/api/auth/', '/api/messages', '/api/notifications', '/api/orders', '/api/technicians'];
    if (handled.some(h => url.includes(h))) {
        return;
    }
    console.log(`[MOCK-FALLBACK] ${route.request().method()} ${url}`);
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
    });
  });
}
