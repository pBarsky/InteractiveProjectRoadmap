export interface Roadmap{
    id?: number;
    name: string;
    description?: string;
    startsOn: Date;
    endsOn?: Date;
    commonFormError?: string;
}

export class DefaultRoadmap implements Roadmap {
    id?: number;
    name: string = '';
    description?: string;
    startsOn: Date = new Date();
    endsOn?: Date;
    commonFormError?: string;
}
