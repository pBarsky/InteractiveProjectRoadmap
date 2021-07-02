import { makeAutoObservable } from 'mobx';

export interface CommonStore {
	appLoaded: boolean;
	setAppLoaded(): void;
}

export class DefaultCommonStore implements CommonStore {
	private _appLoaded = false;

	public constructor () {
		makeAutoObservable(this);
	}

	public get appLoaded (): boolean {
		return this._appLoaded;
	}

	public set appLoaded (value: boolean) {
		this._appLoaded = value;
	}

	public setAppLoaded = (val = true): void => {
		this.appLoaded = val;
	};
}

export default new DefaultCommonStore();
