import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '@config/environment';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get<T>(url: string, params = {}, config = {}): Promise<T> {
    return this.axiosInstance
      .get(url, { params, ...config })
      .then((res: AxiosResponse<T>) => res.data);
  }

  post<T>(url: string, data = {}, config = {}): Promise<T> {
    return this.axiosInstance
      .post(url, data, config)
      .then((res: AxiosResponse<T>) => res.data);
  }

  put<T>(url: string, data = {}, config = {}): Promise<T> {
    return this.axiosInstance
      .put(url, data, config)
      .then((res: AxiosResponse<T>) => res.data);
  }

  delete<T>(url: string, config = {}): Promise<T> {
    return this.axiosInstance
      .delete(url, config)
      .then((res: AxiosResponse<T>) => res.data);
  }
}

export const apiService = new ApiService();
