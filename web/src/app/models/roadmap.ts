import { format } from 'date-fns';

export interface Roadmap{
    id: number;
    name: string;
    description: string | null;
    startsOn: Date;
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
    name: string = '';
    description: string | null ='';
    startsOn: string = format(new Date(), "yyyy-MM-dd'T'hh:mm");
    endsOn: string | null = '';
    commonFormError?: string;
}
