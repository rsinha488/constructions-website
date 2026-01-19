import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Super Admin routes
        if (path.startsWith('/super-admin') && token?.role !== UserRole.SUPER_ADMIN) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Admin routes
        if (path.startsWith('/admin') && path !== '/admin') {
            if (token?.role !== UserRole.ADMIN && token?.role !== UserRole.SUPER_ADMIN) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }

        // Dashboard routes
        if (path.startsWith('/dashboard') && !token) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                // Only require auth for matched routes
                if (path.startsWith('/dashboard') || (path.startsWith('/admin') && path !== '/admin') || path.startsWith('/super-admin')) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/super-admin/:path*'],
};
