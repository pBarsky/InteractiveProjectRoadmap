import axios, { AxiosError, AxiosResponse } from 'axios'
import { browserHistory } from '../../app/layout/App'
import { User, UserFormValues } from '../models/user'
import { store } from '../stores/store'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

const responseBody = (response: AxiosResponse) => response.data

const requests = {
  get: <T>(url: string) => instance.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    instance.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) =>
    instance.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => instance.delete<T>(url).then(responseBody)
}

instance.interceptors.request.use(
  (config) => {
    const token = store.commonStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

function handle400 (data: any) {
  if (data.errors) {
    const modelStateErrors = []
    for (const key in data.errors) {
      if (data.errors[key]) {
        modelStateErrors.push(data.errors[key])
      }
    }
    throw modelStateErrors.flat()
  }
}

function handle401 (headers: any) {
  if (headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
    store.userStore.logout()
  }
}

instance.interceptors.response.use(
  async (response) => response,
  (error: AxiosError) => {
    const { data, status, headers } = error.response!
    switch (status) {
      case 400:
        handle400(data)
        break
      case 401:
        handle401(headers)
        break
      case 404:
        browserHistory.push('/not-found')
        break
    }
    return Promise.reject(error)
  }
)

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) =>
    requests.post<User>('/account/register', user),
  refreshToken: () => requests.post<User>('/account/refreshToken', {})
}

const agent = {
  Account
}

export default agent
