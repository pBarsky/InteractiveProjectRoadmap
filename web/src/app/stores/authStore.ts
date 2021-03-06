import { makeAutoObservable } from 'mobx';
import { User, UserFormValues } from '../models/user';
import authService from '../services/authService';

export interface AuthStore {
	token: string | null;
	user: User | null;
	refreshTokenTimeout: ReturnType<typeof setTimeout> | null;
	isLoggedIn: boolean;
	login(creds: UserFormValues): Promise<void>;
	register(creds: UserFormValues): Promise<void>;
	logout(): void;
	fetchUser(): Promise<void>;
	refreshToken(): Promise<void>;
}

export class DefaultAuthStore implements AuthStore {
	private _user: User | null = null;
	private _refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;
	private _token: string | null = window.localStorage.getItem('jwt');

	public constructor () {
		makeAutoObservable(this);
	}

	public get refreshTokenTimeout (): ReturnType<typeof setTimeout> | null {
		return this._refreshTokenTimeout;
	}

	public set refreshTokenTimeout (value: ReturnType<typeof setTimeout> | null) {
		this._refreshTokenTimeout = value;
	}

	public get user (): User | null {
		return this._user;
	}

	public set user (value: User | null) {
		this._user = value;
	}

	public get isLoggedIn (): boolean {
		return !!this.user;
	}

	public get token (): string | null {
		return this._token;
	}

	public set token (value: string | null) {
		this._token = value;
	}

	public setToken = (token: string | null): void => {
		this.token = token;
		if (token) {
			window.localStorage.setItem('jwt', token);
		} else {
			window.localStorage.removeItem('jwt');
		}
	};

	public login = async (creds: UserFormValues): Promise<void> => {
		try {
			const { data: user } = await authService.login(creds);
			this.setToken(user.token);
			this.setUser(user);
			this.startRefreshTokenTimer(user);
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public register = async (creds: UserFormValues): Promise<void> => {
		try {
			const { data: user } = await authService.register(creds);
			this.setToken(user.token);
			this.setUser(user);
			this.startRefreshTokenTimer(user);
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public logout = (): void => {
		this.stopRefreshTokenTimer();
		this.setToken(null);
		window.localStorage.removeItem('jwt');
		this.setUser(null);
	};

	public setUser = (user: User | null): void => {
		this.user = user;
	};

	public fetchUser = async (): Promise<void> => {
		try {
			const { data: user } = await authService.currentUser();
			this.setUser(user);
			this.setToken(user.token);
			this.startRefreshTokenTimer(user);
		} catch (error) {
			console.debug(error);
		}
	};

	public refreshToken = async (): Promise<void> => {
		this.stopRefreshTokenTimer();
		try {
			const { data: user } = await authService.refreshToken();
			this.setUser(user);
			this.setToken(user.token);
			this.startRefreshTokenTimer(user);
		} catch (error) {
			console.debug(error);
		}
	};

	private startRefreshTokenTimer = (user: User): void => {
		const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
		const expires = new Date(jwtToken.exp * 1000);
		const timeout = expires.getTime() - Date.now() - 60 * 1000;
		this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
	};

	private stopRefreshTokenTimer = (): void => {
		if (this.refreshTokenTimeout) {
			clearTimeout(this.refreshTokenTimeout);
		}
	};
}

export default new DefaultAuthStore();
