import { format } from 'date-fns';
import constants from '../constants/constants';

export enum Status {
	New,
	InProgress,
	Done,
}

export interface StatusSelectOption {
	value: Status;
	label: string;
}

export interface Milestone {
	id: number;
	parentProjectId: number;
	name: string;
	description: string | null;
	endsOn: Date | null;
	posX: number;
	posY: number;
	connectedToId: number | null;
	status: Status;
}

export interface MilestoneFormValues {
	name: string;
	description: string | null;
	endsOn: string;
	parentProjectId: number;
	posX: number;
	posY: number;
	connectedToId: number | null;
	status: Status;
	commonFormError?: string;
}

export class DefaultMilestoneFormValues implements MilestoneFormValues {
	public name = '';
	public description: string | null = '';
	public parentProjectId = 0;
	public posX = 0;
	public connectedToId: number | null = null;
	public posY = 0;
	public endsOn: string = format(
		new Date().setDate(new Date().getDate() + 1),
		constants.dateFormat
	);

	public status: Status = Status.New;
	public commonFormError?: string;
}
