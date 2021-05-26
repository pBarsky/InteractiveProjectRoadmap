import { format } from 'date-fns';

export enum Status {
  ToBeStarted,
  WorkInProgress,
  Done
};

export interface Milestone{
    id: number;
    name: string;
    description: string | null;
    startsOn: Date;
    endsOn: Date | null;
    status: Status;
}

export interface MilestoneFormValues {
    name: string;
    description: string | null;
    startsOn: string;
    endsOn: string | null;
    status: Status;
    commonFormError?: string;
}

export class DefaultMilestoneFormValues implements MilestoneFormValues {
    name: string = '';
    description: string | null ='';
    startsOn: string = format(new Date(), "yyyy-MM-dd'T'hh:mm");
    endsOn: string | null = '';
    status: Status = Status.ToBeStarted;
    commonFormError?: string;
}
