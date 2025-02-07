import ApiClient from './apiClient';
import Cookies from 'js-cookie';

const apiClient = new ApiClient();
const adminPrefix = 'admin/';

const adminLogin = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>(adminPrefix + 'login', request);
};

const adminLogout = async (request: any): Promise<any> => {
    const token = Cookies.get('admin_token');
    apiClient.setHeader('Authorization', `Bearer ${token}`);
    return await apiClient.post<any[]>(adminPrefix + 'logout', request);
};

const authService = {
    adminLogin,
    adminLogout,
};

export default authService;
