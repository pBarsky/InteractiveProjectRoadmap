export default {
	api: {
		account: {
			login: '/api/account/login',
			register: '/api/account/register',
			refreshToken: '/api/account/refreshToken',
			current: '/api/account'
		},
		roadmap: {
			get: (id: number): string => `/api/roadmap/${id}`,
			getAll: '/api/roadmap',
			add: '/api/roadmap',
			update: '/api/roadmap',
			delete: (id: number): string => `/api/roadmap/${id}`
		},
		milestone: {
			get: (id: number): string => `/api/milestones/${id}`,
			getAll: (idRoadmap: number): string => `/api/milestones/of-project/${idRoadmap}`,
			add: '/api/milestones',
			update: '/api/milestones',
			delete: (id: number): string => `/api/milestones/${id}`
		},
		image: {
			add: '/api/roadmap/add-image',
			update: '/api/roadmap/update-image',
			delete: (roadmapId: number): string => `/api/roadmap/delete-image/${roadmapId}`
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
