import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get('admin_token');
    const expired = req.cookies.get('admin_expired');

    if (!token || !expired) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (parseInt(expired?.value || '') < currentTime) {
        const response = NextResponse.redirect(new URL('/admin/login', req.url));
        response.cookies.delete('admin_token');
        response.cookies.delete('admin_expired');
        return response;
    }

    return NextResponse.next();
}
