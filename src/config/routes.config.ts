/**
 * 🗺️ Routes Configuration - Vantage Lane
 * Auto-generated and maintained by create-page.js
 */

export interface RouteConfig {
  path: string;
  title: string;
  layout: 'marketing' | 'dashboard' | 'auth';
  hero: boolean;
  requiresAuth?: boolean;
}

const routes: Record<string, RouteConfig> = {};

export function addRoute(key: string, config: RouteConfig) {
  routes[key] = config;
}

export function getRoute(key: string): RouteConfig | undefined {
  return routes[key];
}

export function getAllRoutes(): Record<string, RouteConfig> {
  return routes;
}

// Auto-generated routes:
addRoute('services', {
  path: '/services',
  title: 'Services',
  layout: 'marketing',
  hero: true,
  requiresAuth: false,
});
addRoute('contact', {
  path: '/contact',
  title: 'Contact',
  layout: 'marketing',
  hero: true,
  requiresAuth: false,
});
