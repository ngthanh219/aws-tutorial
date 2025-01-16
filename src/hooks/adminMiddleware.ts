import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get('admin_token');
    const user = req.cookies.get('admin_info');
    let auth = {
        isLogged: false,
        token: '',
        user: {}
    };

    if (!token || !user) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    auth.isLogged = true;
    auth.token = token.value || '';
    auth.user = JSON.parse(user.value || '{}');

    return NextResponse.next();
}
