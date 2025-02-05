import ApiClient from './apiClient';

const apiClient = new ApiClient();

const adminLogin = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('login', request);
};

const adminLogout = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('logout', request);
};

const autheService = {
    adminLogin,
    adminLogout,
};

export default autheService;
