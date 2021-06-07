import { makeAutoObservable, runInAction } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../../features/common/routing/routes';
import defaultDict from '../dictionaries/defaultDict';
import { Milestone, MilestoneFormValues } from '../models/milestone';
import { Roadmap } from '../models/roadmap';
import milestoneService from '../services/milestoneService';

export interface MilestoneStore {
	milestones: Milestone[];
	selectedMilestone: Milestone | null;
	loading: boolean;
	getAll(roadmap: Roadmap): Promise<void>;
	get(id: number): Promise<void>;
	addMilestone(milestone: MilestoneFormValues): Promise<void>;
	updateMilestone(milestone: Milestone): Promise<void>;
	deleteMilestone(id: number): Promise<void>;
}

export class DefaultMilestoneStore implements MilestoneStore {
	private _milestones: Milestone[] = [];
	private _selectedMilestone: Milestone | null = null;
	private _loading: boolean = false;
	constructor () {
		makeAutoObservable(this);
	}

	public get loading (): boolean {
		return this._loading;
	}

	public set loading (value: boolean) {
		this._loading = value;
	}

	public get milestones (): Milestone[] {
		return this._milestones;
	}

	public set milestones (value: Milestone[]) {
		this._milestones = value;
	}

	public get selectedMilestone (): Milestone | null {
		return this._selectedMilestone;
	}

	public set selectedMilestone (value: Milestone | null) {
		this._selectedMilestone = value;
	}

	getAll = async (roadmap: Roadmap) => {
		try {
			this.loading = true;
			const { data } = await milestoneService.getAll(roadmap.id);
			this.setMilestones(data);
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	get = async (id: number) => {
		const milestone: Milestone | undefined = this.milestones.find((x) => x.id === id);
		if (milestone) {
			this.selectedMilestone = milestone;
			this.loading = false;
			return;
		}
		try {
			this.loading = true;
			const { data } = await milestoneService.get(id);
			const newMilestone: Milestone = this.dtoToMilestone(data);
			this.milestones.push(newMilestone);
			this.selectedMilestone = newMilestone;
		} catch (error) {
			browserHistory.push(routes.user.dashboard);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	setMilestones = (milestones: Milestone[]) => {
		this.milestones = milestones.map((milestone) => this.dtoToMilestone(milestone));
	};

	addMilestone = async (values: MilestoneFormValues): Promise<void> => {
		try {
			const { data: id } = await milestoneService.add(values);
			const milestone: Milestone = {
				...values,
				id: id,
				endsOn: new Date(values.endsOn)
			};
			runInAction(() => {
				this.milestones.push(milestone);
			});
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	updateMilestone = async (values: Milestone): Promise<void> => {
		this.loading = true;
		try {
			const { data } = await milestoneService.update(values);
			if (!data) {
				throw new Error(defaultDict.errors.milestones.failedEdit);
			}
			this.setMilestone(values);
			this.selectedMilestone = { ...values };
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	setMilestone = (milestone: Milestone) => {
		const index = this.milestones.findIndex((x) => x.id === milestone.id);
		if (index === -1) {
			return;
		}
		const newMilestones = [...this.milestones];
		newMilestones[index] = { ...milestone };
		this.setMilestones(newMilestones);
	};

	deleteMilestone = async (id: number): Promise<void> => {
		this.loading = true;
		try {
			const { data } = await milestoneService.delete(id);
			if (!data) {
				throw new Error(defaultDict.errors.milestones.failedDelete);
			}
			this.selectedMilestone = null;
			this.setMilestones(this.milestones.filter((x) => x.id !== id));
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.loading = false;
		}
	};

	private dtoToMilestone: (dto: Milestone) => Milestone = (dto: Milestone) => {
		return {
			...dto,
			endsOn: this.adjustTimezone(dto.endsOn)!
		};
	};

	private adjustTimezone = (date: Date | null) => {
		if (date == null) {
			return date;
		}
		const worker = new Date(date);
		const timeOffsetInMS: number = worker.getTimezoneOffset() * 60000;
		worker.setTime(worker.getTime() - timeOffsetInMS);
		return worker;
	};
}

export default new DefaultMilestoneStore();
