// Route paths constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  
  //Attendance
  ATTENDANCE: '/attendance',
  
  SCANQR: '/scan-qr',
  CREATEQR: '/qr/create',
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  
  // User
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Analytics
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  
  // Others
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  NOT_FOUND: '*'
};

// Navigation groups
export const NAV_GROUPS = {
  MAIN: 'main',
  ECOMMERCE: 'ecommerce',
  REPORTS: 'reports',
  SETTINGS: 'settings'
};