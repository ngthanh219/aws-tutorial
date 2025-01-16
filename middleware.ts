import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminMiddleware } from './src/hooks/adminMiddleware';

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;

    if (url.startsWith('/admin')) {
        if (url !== '/admin/login') {
            return adminMiddleware(req);
        } else if (req.cookies.get('admin_token')) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*'
    ],
};
