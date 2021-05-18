import axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import authStore from '../stores/authStore';

export interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T>;
}

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const onError = (error: AxiosError): Promise<AxiosError> => {
    const { response } = error;
    if (response?.status === 401) {
      browserHistory.push(routes.auth.login);
    }
    return Promise.reject(error);
  };

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const jwt = authStore.token;
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    config.withCredentials = true;
    return config;
  }, onError);

  api.interceptors.response.use((response: AxiosResponse) => response, onError);

  return api;
};
