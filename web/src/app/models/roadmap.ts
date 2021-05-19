export interface Roadmap{
    id: number;
    name: string;
    description: string | null;
    startsOn: Date;
    endsOn: Date | null;
}
