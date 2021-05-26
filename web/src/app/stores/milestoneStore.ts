import { makeAutoObservable } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import { Milestone, MilestoneFormValues } from '../models/milestone';
import milestoneService from '../services/milestoneService';

export interface MilestoneStore {
  milestones: Milestone[];
  selectedMilestone: Milestone | null;
  loadMilestones(): Promise<void>;
  loadMilestone(id: number): Promise<void>;
  loading: boolean;
  addMilestone(milestone: MilestoneFormValues): Promise<void>;
}

export class DefaultMilestoneStore implements MilestoneStore {
  private _milestones: Milestone[] = [];
  private _selectedMilestone: Milestone | null = null;
  private _loading: boolean = false;
  constructor () {
    makeAutoObservable(this);
  }

  public get loading (): boolean {
    return this._loading;
  }

  public set loading (value: boolean) {
    this._loading = value;
  }

  public get milestones (): Milestone[] {
    return this._milestones;
  }

  public set milestones (value: Milestone[]) {
    this._milestones = value;
  }

  public get selectedMilestone (): Milestone | null {
    return this._selectedMilestone;
  }

  public set selectedMilestone (value: Milestone | null) {
    this._selectedMilestone = value;
  }

  loadMilestones = async () => {
    try {
      this.loading = true;
      const { data } = await milestoneService.getAll();
      this.setMilestones(data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.loading = false;
    }
  };

  loadMilestone = async (id: number) => {
    const milestone: Milestone | undefined = this.milestones.find((x) => x.id === id);
    if (milestone) {
      this.selectedMilestone = milestone;
      this.loading = false;
      return;
    }
    try {
      this.loading = true;
      const { data } = await milestoneService.get(id);
      const newMilestone: Milestone = this.dtoToMilestone(data);
      this.milestones.push(newMilestone);
      this.selectedMilestone = newMilestone;
    } catch (error) {
      browserHistory.push(routes.user.dashboard);
    } finally {
      this.loading = false;
    }
  };

  setMilestones = (milestones: Milestone[]) => {
    this.milestones = milestones.map((milestone) => this.dtoToMilestone(milestone));
  };

  addMilestone = async (values: MilestoneFormValues): Promise<void> => {
    try {
      const { data: id } = await milestoneService.add(values);
      const milestone: Milestone = {
        ...values,
        id: id,
        startsOn: new Date(values.startsOn),
        endsOn: values.endsOn ? new Date(values.endsOn) : null,
        status: values.status
      };
      this.milestones.push(milestone);
      browserHistory.push(`${routes.milestone.list}/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  private dtoToMilestone: (dto: Milestone) => Milestone = (dto: Milestone) => {
    return {
      ...dto,
      startsOn: this.adjustTimezone(dto.startsOn)!,
      endsOn: this.adjustTimezone(dto.endsOn)
    };
  };

  private adjustTimezone = (date: Date | null) => {
    if (date == null) {
      return date;
    }
    const worker = new Date(date);
    const timeOffsetInMS: number = worker.getTimezoneOffset() * 60000;
    worker.setTime(worker.getTime() - timeOffsetInMS);
    return worker;
  };
}

export default new DefaultMilestoneStore();
