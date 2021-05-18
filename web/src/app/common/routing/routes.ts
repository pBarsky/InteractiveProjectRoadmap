export default {
  api: {
    account: {
      login: '/api/account/login',
      register: '/api/account/register',
      refreshToken: '/api/account/refreshToken',
      current: '/api/account'
    },
    roadmap: {
      get: (id: number) => `/api/roadmap/get/${id}`,
      getAll: '/api/roadmap/getAll',
      add: '/api/roadmap/add'
    }
  },
  common: {
    notFound: '/not-found',
    home: '/'
  },
  user: {
    dashboard: '/dashboard'
  },
  auth: {
    login: '/login',
    register: '/register'
  }
};
