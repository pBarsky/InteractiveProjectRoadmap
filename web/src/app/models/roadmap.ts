import { format } from 'date-fns';
import constants from '../constants/constants';

export interface Roadmap {
	id: number;
	name: string;
	description: string | null;
	startsOn: Date;
	imageUrl?: string;
	endsOn: Date | null;
}

export class DefaultRoadmap implements Roadmap {
	public id = 0;
	public name = '';
	public description: string | null = null;
	public startsOn: Date = new Date();
	public imageUrl?: string;
	public endsOn: Date | null = null;
}
export interface RoadmapFormValues {
	name: string;
	description: string | null;
	startsOn: string;
	endsOn: string | null;
	commonFormError?: string;
}

export class DefaultRoadmapFormValues implements RoadmapFormValues {
	public name = '';
	public description: string | null = '';
	public startsOn: string = format(new Date(), constants.dateFormat);
	public endsOn: string | null = '';
	public commonFormError?: string;
}
