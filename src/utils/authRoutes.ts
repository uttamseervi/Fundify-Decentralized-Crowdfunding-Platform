// utils/authRoutes.ts

export const publicRouteRegex = /^\/($|how-it-works$|campaigns$)/;

export const protectedRouteRegex = /^\/(dashboard|campaign)(\/|$)|^\/create$/;

/**
 * Helper to determine if route is public
 */
export const isPublicRoute = (pathname: string): boolean => {
    return publicRouteRegex.test(pathname);
};

/**
 * Helper to determine if route is protected
 */
export const isProtectedRoute = (pathname: string): boolean => {
    return protectedRouteRegex.test(pathname);
};
