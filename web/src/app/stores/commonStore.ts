import { makeAutoObservable } from 'mobx';

export interface CommonStore {
  token: string | null;
  appLoaded: boolean;
  setToken(token: string | null): void;
  setAppLoaded(): void;
}

export class DefaultCommonStore implements CommonStore {
  private _token: string | null = window.localStorage.getItem('jwt');
  private _appLoaded: boolean = false;

  constructor () {
    makeAutoObservable(this);
  }

  public get token (): string | null {
    return this._token;
  }

  public set token (value: string | null) {
    this._token = value;
  }

  public get appLoaded (): boolean {
    return this._appLoaded;
  }

  public set appLoaded (value: boolean) {
    this._appLoaded = value;
  }

  setToken = (token: string | null) => {
    this.token = token;
    if (token) {
      window.localStorage.setItem('jwt', token);
    } else {
      window.localStorage.removeItem('jwt');
    }
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}

export default new DefaultCommonStore();
