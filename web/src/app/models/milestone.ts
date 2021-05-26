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
    endsOn: Date;
    status: Status;
}

export interface MilestoneFormValues {
    name: string;
    description: string | null;
    endsOn: string;
    status: Status;
    commonFormError?: string;
}

export class DefaultMilestoneFormValues implements MilestoneFormValues {
    name: string = '';
    description: string | null ='';
    endsOn: string = format(new Date(), "yyyy-MM-dd'T'hh:mm");
    status: Status = Status.ToBeStarted;
    commonFormError?: string;
}
