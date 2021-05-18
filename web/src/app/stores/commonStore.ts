import { makeAutoObservable } from 'mobx';

export interface CommonStore {
  appLoaded: boolean;
  setAppLoaded(): void;
}

export class DefaultCommonStore implements CommonStore {
  private _appLoaded: boolean = false;

  constructor () {
    makeAutoObservable(this);
  }

  public get appLoaded (): boolean {
    return this._appLoaded;
  }

  public set appLoaded (value: boolean) {
    this._appLoaded = value;
  }

  setAppLoaded = (val: boolean = true) => {
    this.appLoaded = val;
  };
}

export default new DefaultCommonStore();
