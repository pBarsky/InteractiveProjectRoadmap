import axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig
} from 'axios';

export interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T>;
}

export const createApiClient = (jwtToken: string | null): AxiosInstance => {
  const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      Promise.reject(error);
    }
  );

  return api;
};
