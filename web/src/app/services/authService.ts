import { AxiosPromise } from 'axios';
import routes from '../../features/common/routing/routes';
import { ApiClient, createApiClient } from '../api/apiClient';
import { User, UserFormValues } from '../models/user';

export interface AuthService {
	currentUser(): AxiosPromise<User>;
	login(user: UserFormValues): AxiosPromise<User>;
	register(user: UserFormValues): AxiosPromise<User>;
	refreshToken(): AxiosPromise<User>;
}

export class DefaultAuthService implements AuthService {
	public constructor (private api: ApiClient) {}

	public login (user: UserFormValues): AxiosPromise<User> {
		return this.api.post<User>(routes.api.account.login, user);
	}

	public register (user: UserFormValues): AxiosPromise<User> {
		return this.api.post<User>(routes.api.account.register, user);
	}

	public refreshToken (): AxiosPromise<User> {
		return this.api.post<User>(routes.api.account.refreshToken);
	}

	public currentUser (): AxiosPromise<User> {
		return this.api.get<User>(routes.api.account.current);
	}
}

export default new DefaultAuthService(createApiClient());
