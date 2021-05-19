export default {
  api: {
    account: {
      login: '/api/account/login',
      register: '/api/account/register',
      refreshToken: '/api/account/refreshToken',
      current: '/api/account'
    },
    roadmap: {
      getAll: '/api/roadmap/',
      get: (id: number) => `/api/roadmap/${id}`,
      add: '/api/roadmap/'
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
  },
  roadmap: {
    list: '/roadmap',
    details: '/roadmap/:id'
  }
};
