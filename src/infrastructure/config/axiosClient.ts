import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import environment from './environment';
import { tokenManager } from './TokenManager';

class AxiosClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: environment.API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenManager.getAuthHeader(),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Ensure bearer token is always present
        if (!config.headers.Authorization && tokenManager.hasToken()) {
          config.headers.Authorization = tokenManager.getAuthHeader();
        }
        
        if (environment.IS_DEVELOPMENT) {
          console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
          console.log('🔑 Auth:', config.headers.Authorization);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (environment.IS_DEVELOPMENT) {
          console.log('✅ Response:', response.status, response.config.url);
        }
        return response;
      },
      (error) => {
        if (environment.IS_DEVELOPMENT) {
          console.error('❌ Error:', error.response?.status, error.config?.url);
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const axiosClient = new AxiosClient();