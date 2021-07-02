import { makeAutoObservable, runInAction } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../../features/common/routing/routes';
import defaultDict from '../dictionaries/defaultDict';
import { Roadmap, RoadmapFormValues } from '../models/roadmap';
import imageService from '../services/imageService';
import roadmapService from '../services/roadmapService';

export type BackgroundSize = [number, number];

export interface RoadmapStore {
	roadmaps: Roadmap[];
	backgroundImageSize: BackgroundSize;
	selectedRoadmap: Roadmap | null;
	loading: boolean;
	setBackgroundImageSize(size: BackgroundSize): void;
	loadRoadmaps(): Promise<void>;
	loadRoadmap(id: number): Promise<void>;
	addRoadmap(roadmap: RoadmapFormValues): Promise<void>;
	updateRoadmap(roadmap: Roadmap): Promise<void>;
	deleteRoadmap(id: number): Promise<void>;
	updateImage(formData: FormData): Promise<void>;
	deleteImage(id: number): Promise<void>;
}

export class DefaultRoadmapStore implements RoadmapStore {
	private _roadmaps: Roadmap[] = [];
	private _selectedRoadmap: Roadmap | null = null;
	private _loading = false;
	private _backgroundImageSize: BackgroundSize = [1000, 1000];

	public constructor () {
		makeAutoObservable(this);
	}

	public get backgroundImageSize (): BackgroundSize {
		return this._backgroundImageSize;
	}

	public set backgroundImageSize (value: BackgroundSize) {
		this._backgroundImageSize = value;
	}

	public get loading (): boolean {
		return this._loading;
	}

	public set loading (value: boolean) {
		this._loading = value;
	}

	public get roadmaps (): Roadmap[] {
		return this._roadmaps;
	}

	public set roadmaps (value: Roadmap[]) {
		this._roadmaps = value;
	}

	public get selectedRoadmap (): Roadmap | null {
		return this._selectedRoadmap;
	}

	public set selectedRoadmap (value: Roadmap | null) {
		this._selectedRoadmap = value;
	}

	public setBackgroundImageSize (size: BackgroundSize): void {
		this._backgroundImageSize = [...size];
	}

	public loadRoadmaps = async (): Promise<void> => {
		try {
			this.loading = true;
			const { data } = await roadmapService.getAll();
			this.setRoadmaps(data);
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	public loadRoadmap = async (id: number): Promise<void> => {
		const roadmap: Roadmap | undefined = this.roadmaps.find((x) => x.id === id);
		if (roadmap) {
			this.selectedRoadmap = roadmap;
			this.loading = false;
			return;
		}
		try {
			this.loading = true;
			const { data } = await roadmapService.get(id);
			const newRoadmap: Roadmap = this.dtoToRoadmap(data);
			this.roadmaps.push(newRoadmap);
			this.selectedRoadmap = newRoadmap;
		} catch (error) {
			browserHistory.push(routes.user.dashboard);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	public setRoadmaps = (roadmaps: Roadmap[]): void => {
		this.roadmaps = roadmaps.map((roadmap) => this.dtoToRoadmap(roadmap));
	};

	public addRoadmap = async (values: RoadmapFormValues): Promise<void> => {
		try {
			const { data: id } = await roadmapService.add(values);
			const roadmap: Roadmap = {
				...values,
				id: id,
				startsOn: new Date(values.startsOn),
				endsOn: values.endsOn ? new Date(values.endsOn) : null
			};
			runInAction(() => {
				this.roadmaps.push(roadmap);
			});
			browserHistory.push(`${routes.roadmap.list}/${id}`);
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public updateRoadmap = async (values: Roadmap): Promise<void> => {
		this.loading = true;
		try {
			const { data } = await roadmapService.update(values);
			if (!data) {
				throw new Error(defaultDict.errors.roadmap.failedEdit);
			}
			this.selectedRoadmap = { ...values };
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	public setRoadmap = (roadmap: Roadmap): void => {
		const index = this.roadmaps.findIndex((x) => x.id === roadmap.id);
		if (index === -1) {
			return;
		}
		const newRoadmaps = [...this.roadmaps];
		newRoadmaps[index] = { ...roadmap };
		this.setRoadmaps(newRoadmaps);
	};

	public deleteRoadmap = async (id: number): Promise<void> => {
		this.loading = true;
		try {
			const { data } = await roadmapService.delete(id);
			if (!data) {
				throw new Error(defaultDict.errors.roadmap.failedDelete);
			}
			this.selectedRoadmap = null;
			this.roadmaps = this.roadmaps.filter((x) => x.id !== id);
			browserHistory.push(routes.user.dashboard);
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	public updateImage = async (formData: FormData): Promise<void> => {
		const { data: backgroundUrl } = await imageService.update(formData);
		runInAction(() => {
			this.selectedRoadmap!.imageUrl = backgroundUrl;
		});
	};

	public deleteImage = async (id: number): Promise<void> => {
		const { data: result } = await imageService.delete(id);
		if (!result) {
			throw Error('Could not delete image');
		}
		runInAction(() => {
			this.selectedRoadmap!.imageUrl = undefined;
		});
	};

	private dtoToRoadmap: (dto: Roadmap) => Roadmap = (dto: Roadmap) => {
		return {
			...dto,
			startsOn: this.adjustTimezone(dto.startsOn)!,
			endsOn: this.adjustTimezone(dto.endsOn)
		};
	};

	private adjustTimezone = (date: Date | null): Date | null => {
		if (date == null) {
			return date;
		}
		const worker = new Date(date);
		const timeOffsetInMS: number = worker.getTimezoneOffset() * 60000;
		worker.setTime(worker.getTime() - timeOffsetInMS);
		return worker;
	};
}

export default new DefaultRoadmapStore();
