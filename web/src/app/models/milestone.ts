import { format } from 'date-fns';

export enum Status {
  New,
  InProgress,
  Done
};

export interface Milestone{
    id: number;
    parentProjectId: number;
    name: string;
    description: string | null;
    endsOn: Date;
    status: Status;
}

export interface MilestoneFormValues {
    name: string;
    description: string | null;
    endsOn: string;
    parentProjectId: number;
    status: Status;
    commonFormError?: string;
}

export class DefaultMilestoneFormValues implements MilestoneFormValues {
    name: string = '';
    description: string | null ='';
    parentProjectId: number = 0;
    endsOn: string = format(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    status: Status = Status.New;
    commonFormError?: string;
}
