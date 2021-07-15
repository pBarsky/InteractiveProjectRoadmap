import { format } from 'date-fns';
import constants from '../constants/constants';

export enum Status {
	New,
	InProgress,
	Done,
}

export enum HandleId {
	Left = 0,
	Right = 1,
}

export interface StatusSelectOption {
	value: Status;
	label: string;
	backgroundColor?: string;
}

export interface IMilestone {
	id: number;
	parentProjectId: number;
	name: string;
	description: string | null;
	endsOn: Date | null;
	posX: number;
	posY: number;
	connectedToId: number | null;
	connectedToTargetHandleId: HandleId | null;
	connectedToSourceHandleId: HandleId | null;
	status: Status;
}

export class Milestone implements IMilestone {
	public id: number;
	public parentProjectId: number;
	public name: string;
	public description: string | null;
	public endsOn: Date | null;
	public posX: number;
	public posY: number;
	public connectedToId: number | null;
	public connectedToTargetHandleId: HandleId | null;
	public connectedToSourceHandleId: HandleId | null;
	public status: Status;

	public constructor ({
		id,
		parentProjectId,
		name,
		description,
		endsOn,
		posX,
		posY,
		connectedToId,
		connectedToTargetHandleId,
		connectedToSourceHandleId,
		status
	}: IMilestone) {
		this.id = id;
		this.parentProjectId = parentProjectId;
		this.name = name;
		this.description = description;
		this.endsOn = endsOn;
		this.posX = posX;
		this.posY = posY;
		this.connectedToId = connectedToId;
		this.connectedToTargetHandleId = connectedToTargetHandleId;
		this.connectedToSourceHandleId = connectedToSourceHandleId;
		this.status = status;
	}

	public isAlreadyConnectedWith (
		target: Milestone,
		milestonePointingToSelf: Milestone | undefined,
		sourceHandleId: HandleId
	): boolean {
		if (this.connectedToId === target.id || target.connectedToId === this.id) {
			console.debug('juz polaczony z nim src');
			return true;
		}
		if (
			milestonePointingToSelf?.connectedToId === this.id &&
			milestonePointingToSelf?.connectedToTargetHandleId === sourceHandleId
		) {
			return true;
		}
		return false;
	}

	public canTargetConnectWithSelf (
		target: Milestone,
		pointingAtTarget: Milestone | undefined,
		sourceHandleId: HandleId,
		targetHandleId: HandleId
	): boolean {
		if (this.connectedToId) {
			console.debug('source', this.name);
			if (target.connectedToId === this.id || this.connectedToId === target.id) {
				console.debug('juz polaczony z nim trgt');
				return false;
			}
			if (this.connectedToSourceHandleId === sourceHandleId) {
				console.debug('juz zajete przez inne polaczenie src');
				return false;
			}
			if (!pointingAtTarget) {
				console.debug('zajety ale nic nie wskauje na target');
				return true;
			}
		}
		if (target.connectedToId) {
			console.debug('juz polaczony');
			return false;
		}
		if (!pointingAtTarget) {
			console.debug('nic nie wskazuje na target');
			return false;
		}
		if (pointingAtTarget.connectedToTargetHandleId === targetHandleId) {
			console.debug('TO SAMO NIE MOZNA');
			return false;
		}
		return true;
	}
}

export interface MilestoneFormValues {
	name: string;
	description: string | null;
	endsOn: string;
	parentProjectId: number;
	posX: number;
	posY: number;
	connectedToId: number | null;
	connectedToTargetHandleId: HandleId | null;
	connectedToSourceHandleId: HandleId | null;
	status: Status;
	commonFormError?: string;
}

export class DefaultMilestoneFormValues implements MilestoneFormValues {
	public name = '';
	public description: string | null = '';
	public parentProjectId = 0;
	public posX = 0;
	public connectedToId: number | null = null;
	public connectedToTargetHandleId: HandleId | null = null;
	public connectedToSourceHandleId: HandleId | null = null;
	public posY = 0;
	public endsOn: string = format(
		new Date().setDate(new Date().getDate() + 1),
		constants.dateFormat
	);

	public status: Status = Status.New;
	public commonFormError?: string;
}
