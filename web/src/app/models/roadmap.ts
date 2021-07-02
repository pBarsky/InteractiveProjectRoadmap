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
