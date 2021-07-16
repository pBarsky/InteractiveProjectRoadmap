import { makeAutoObservable } from 'mobx';

export interface LocationOffset {
	xOffset: number;
	yOffset: number;
}
export interface CommonStore {
	appLoaded: boolean;
	contextMenuLocation: LocationOffset;
	isContextMenuVisible: boolean;
	setAppLoaded(): void;
	setIsContextMenuVisible(value: boolean): void;
	setContextMenuLocation(value: LocationOffset): void;
}

export class DefaultCommonStore implements CommonStore {
	private _appLoaded = false;
	private _contextMenuLocation: LocationOffset = { xOffset: 0, yOffset: 0 };
	private _isContextMenuVisible = false;

	public constructor () {
		makeAutoObservable(this);
	}

	public get contextMenuLocation (): LocationOffset {
		return this._contextMenuLocation;
	}

	public set contextMenuLocation (value: LocationOffset) {
		this._contextMenuLocation = { ...value };
	}

	public get isContextMenuVisible (): boolean {
		return this._isContextMenuVisible;
	}

	public set isContextMenuVisible (value: boolean) {
		this._isContextMenuVisible = value;
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

	public setIsContextMenuVisible = (value: boolean): void => {
		this.isContextMenuVisible = value;
	};

	public setContextMenuLocation = (value: LocationOffset): void => {
		this.contextMenuLocation = { ...value };
	};
}

export default new DefaultCommonStore();
