import Cookies from 'js-cookie';

export function getAdminAuth() {
    const token = Cookies.get('admin_token');
    const user = Cookies.get('admin_info');
    let auth = {
        isLogged: false,
        token: '',
        user: {}
    };

    if (!token || !user) {
        return auth;
    }

    auth.isLogged = true;
    auth.token = token;
    auth.user = JSON.parse(user);

    return auth;
}
