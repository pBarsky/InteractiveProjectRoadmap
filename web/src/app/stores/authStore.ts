import { makeAutoObservable } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import { User, UserFormValues } from '../models/user';
import authService from '../services/authService';
import { store } from './store';

export interface AuthStore {
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

  constructor () {
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

  get isLoggedIn () {
    return !!this.user;
  }

  public login = async (creds: UserFormValues) => {
    try {
      const { data: user } = await authService.login(creds);
      store.commonStore.setToken(user.token);
      this.setUser(user);
      this.startRefreshTokenTimer(user);
      browserHistory.push(routes.user.dashboard);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  public register = async (creds: UserFormValues) => {
    try {
      const { data: user } = await authService.register(creds);
      store.commonStore.setToken(user.token);
      this.setUser(user);
      this.startRefreshTokenTimer(user);
      browserHistory.push(routes.user.dashboard);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  public logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.setUser(null);
    browserHistory.push('/');
  };

  public setUser = (user: User | null) => {
    this.user = user;
  };

  public fetchUser = async () => {
    try {
      const { data: user } = await authService.currentUser();
      this.setUser(user);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  public refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const { data: user } = await authService.refreshToken();
      this.setUser(user);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  private startRefreshTokenTimer = (user: User) => {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  };

  private stopRefreshTokenTimer = () => {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  };
}

export default new DefaultAuthStore();
