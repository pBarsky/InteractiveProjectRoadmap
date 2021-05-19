export default {
  api: {
    account: {
      login: '/api/account/login',
      register: '/api/account/register',
      refreshToken: '/api/account/refreshToken',
      current: '/api/account'
    },
    roadmap: {
      get: (id: number) => `/api/roadmap/${id}`,
      getAll: '/api/roadmap',
      add: '/api/roadmap'
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
    add: '/roadmap/app',
    list: '/roadmap',
    details: '/roadmap/:id'
  }
};
