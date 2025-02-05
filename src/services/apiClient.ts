import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://127.0.0.1:8000/';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public setHeader(name: string, value: string): void {
        this.client.defaults.headers[name] = value;
    }

    private handleResponse<T>(response: { data: any }): T {
        if (response.data.status === 'error') {
            throw new Error(response.data.message || 'An error occurred');
        }

        return response.data;
    }

    public async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return this.handleResponse(response);
    }

    public async post<T>(url: string, data: any): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return this.handleResponse(response);
    }

    public async put<T>(url: string, data: any): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return this.handleResponse(response);
    }

    public async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete<T>(url);
        return this.handleResponse(response);
    }
}

export default ApiClient;
