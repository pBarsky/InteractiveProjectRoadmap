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
			add: '/api/roadmap',
			update: '/api/roadmap',
			delete: (id: number) => `/api/roadmap/${id}`
		},
		milestone: {
			get: (id: number) => `/api/milestones/${id}`,
			getAll: (idRoadmap: number) => `/api/milestones/of-project/${idRoadmap}`,
			add: '/api/milestones',
			update: '/api/milestones',
			delete: (id: number) => `/api/milestones/${id}`
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
		add: '/roadmap/add',
		list: '/roadmap',
		details: '/roadmap/:id'
	},
	milestone: {
		add: '/milestones/add',
		details: '/milestones/:id'
	}
};