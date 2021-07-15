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
	isEditing: boolean;
	isLoading: boolean;
	updatePosition(milestoneId: number, posX: number, posY: number): Promise<void>;
	setIsEditing(value: boolean): void;
	getAll(roadmap: Roadmap): Promise<void>;
	get(id: number): Promise<void>;
	addMilestone(milestone: MilestoneFormValues): Promise<void>;
	updateMilestone(milestone: Milestone): Promise<void>;
	deleteMilestone(id: number): Promise<void>;
}

export class DefaultMilestoneStore implements MilestoneStore {
	private _milestones: Milestone[] = [];
	private _selectedMilestone: Milestone | null = null;
	private _isLoading = false;
	private _isEditing = false;

	public constructor () {
		makeAutoObservable(this);
	}

	public get isEditing (): boolean {
		return this._isEditing;
	}

	public set isEditing (value: boolean) {
		this._isEditing = value;
	}

	public get isLoading (): boolean {
		return this._isLoading;
	}

	public set isLoading (value: boolean) {
		this._isLoading = value;
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

	public setIsEditing = (value: boolean): void => {
		this.isEditing = value;
	};

	public getAll = async (roadmap: Roadmap): Promise<void> => {
		try {
			this.isLoading = true;
			const { data } = await milestoneService.getAll(roadmap.id);
			this.setMilestones(data);
		} catch (error) {
			console.debug(error);
			throw error;
		} finally {
			this.isLoading = false;
		}
	};

	public get = async (id: number): Promise<void> => {
		const milestone: Milestone | undefined = this.milestones.find((x) => x.id === id);
		if (milestone) {
			this.selectedMilestone = milestone;
			this.isLoading = false;
			return;
		}
		try {
			this.isLoading = true;
			const { data } = await milestoneService.get(id);
			const newMilestone: Milestone = this.dtoToMilestone(data);
			this.milestones.push(newMilestone);
			this.selectedMilestone = newMilestone;
		} catch (error) {
			browserHistory.push(routes.user.dashboard);
			throw error;
		} finally {
			this.isLoading = false;
		}
	};

	public setMilestones = (milestones: Milestone[]): void => {
		this.milestones = milestones.map((milestone) => this.dtoToMilestone(milestone));
	};

	public addMilestone = async (values: MilestoneFormValues): Promise<void> => {
		try {
			const { data: id } = await milestoneService.add(values);
			const milestone: Milestone = new Milestone({
				...values,
				id: id,
				endsOn: new Date(values.endsOn)
			});
			runInAction(() => {
				this.milestones.push(milestone);
			});
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public updateMilestone = async (values: Milestone): Promise<void> => {
		try {
			const { data } = await milestoneService.update(values);
			if (!data) {
				throw new Error(defaultDict.errors.milestones.failedEdit);
			}
			this.setMilestone(values);
			this.selectedMilestone = new Milestone({ ...values });
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public updatePosition = async (
		milestoneId: number,
		posX: number,
		posY: number
	): Promise<void> => {
		const milestone = this.milestones.find((x) => x.id === milestoneId);
		if (!milestone) {
			throw new Error(defaultDict.errors.milestones.failedPositionUpdate);
		}
		milestone.posX = Math.round(posX);
		milestone.posY = Math.round(posY);
		this.setMilestone(milestone);
		try {
			const { data } = await milestoneService.update(milestone);
			if (!data) {
				throw new Error(defaultDict.errors.milestones.failedPositionUpdate);
			}
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	public setMilestone = (milestone: Milestone): void => {
		const index = this.milestones.findIndex((x) => x.id === milestone.id);
		if (index === -1) {
			return;
		}
		const newMilestones = [...this.milestones];
		newMilestones[index] = new Milestone({ ...milestone });
		this.setMilestones(newMilestones);
	};

	public deleteMilestone = async (id: number): Promise<void> => {
		try {
			const { data } = await milestoneService.delete(id);
			if (!data) {
				throw new Error(defaultDict.errors.milestones.failedDelete);
			}
			const connectedMilestone = this.milestones.find((x) => x.connectedToId === id);
			if (connectedMilestone) {
				this.setMilestone(
					new Milestone({
						...connectedMilestone,
						connectedToId: null,
						connectedToSourceHandleId: null,
						connectedToTargetHandleId: null
					})
				);
			}
			this.selectedMilestone = null;
			this.setMilestones(this.milestones.filter((x) => x.id !== id));
		} catch (error) {
			console.debug(error);
			throw error;
		}
	};

	private dtoToMilestone: (dto: Milestone) => Milestone = (dto: Milestone) => {
		return new Milestone({
			...dto,
			endsOn: this.adjustTimezone(dto.endsOn)!
		});
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

export default new DefaultMilestoneStore();
