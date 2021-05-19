import { makeAutoObservable } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import { Roadmap } from '../models/roadmap';
import roadmapService from '../services/roadmapService';

export interface RoadmapStore {
  roadmaps: Roadmap[];
  selectedRoadmap: Roadmap | null;
  loadRoadmaps(): Promise<void>;
  loadRoadmap(id: number): Promise<void>;
  loading: boolean;
}

export class DefaultRoadmapStore implements RoadmapStore {
  private _roadmaps: Roadmap[] = [];
  private _selectedRoadmap: Roadmap | null = null;
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

  public get roadmaps (): Roadmap[] {
    return this._roadmaps;
  }

  public set roadmaps (value: Roadmap[]) {
    this._roadmaps = value;
  }

  public get selectedRoadmap (): Roadmap | null {
    return this._selectedRoadmap;
  }

  public set selectedRoadmap (value: Roadmap | null) {
    this._selectedRoadmap = value;
  }

  loadRoadmaps = async () => {
    try {
      this.loading = true;
      const { data } = await roadmapService.fetchRoadmaps();
      this.setRoadmaps(data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.loading = false;
    }
  };

  loadRoadmap = async (id: number) => {
    const roadmap: Roadmap | undefined = this.roadmaps.find((x) => x.id === id);
    if (roadmap) {
      this.selectedRoadmap = roadmap;
      this.loading = false;
      return;
    }
    try {
      this.loading = true;
      const { data } = await roadmapService.fetchRoadmap(id);
      const newRoadmap: Roadmap = this.dtoToRoadmap(data);
      this.roadmaps.push(newRoadmap);
      this.selectedRoadmap = newRoadmap;
    } catch (error) {
      browserHistory.push(routes.user.dashboard);
    } finally {
      this.loading = false;
    }
  };

  setRoadmaps = (roadmaps: Roadmap[]) => {
    this.roadmaps = roadmaps.map((roadmap) => this.dtoToRoadmap(roadmap));
  };

  private dtoToRoadmap: (dto: Roadmap) => Roadmap = (dto: Roadmap) => {
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

export default new DefaultRoadmapStore();
