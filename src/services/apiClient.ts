import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://127.0.0.1:8000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            }
        });
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

    public async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete<T>(url);
        return response.data;
    }
}

export default ApiClient;
