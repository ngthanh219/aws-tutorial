import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.API_URL;

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.client.interceptors.response.use(
            response => response,
            error => {
                if (error.response.status === 401) {
                    Cookies.remove('admin_token');
                    Cookies.remove('admin_expired');

                    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                        window.location.href = '/admin/login';
                    }
                }
                return Promise.reject(error);
            }
        );       
    }

    public setHeader(name: string, value: string): void {
        this.client.defaults.headers[name] = value;
    }

    public async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    public async post<T>(url: string, data: any): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return response.data;
    }

    public async put<T>(url: string, data: any): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return response.data;
    }

    public async delete<T>(url: string, data: any): Promise<T> {
        const response = await this.client.delete<T>(url, { data });
        return response.data;
    }
}

export default ApiClient;
