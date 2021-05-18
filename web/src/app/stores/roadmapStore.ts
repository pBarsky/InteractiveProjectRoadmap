import { makeAutoObservable } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import { Roadmap, RoadmapFormValues } from '../models/roadmap';
import roadmapService from '../services/roadmapService';

export interface RoadmapStore {
  roadmaps: Roadmap[];
  selectedRoadmap: Roadmap | null;
  loadRoadmaps(): Promise<void>;
  selectRoadmap(id: number): Promise<void>;
  setRoadmaps(roadmaps: Roadmap[]): Promise<void>;
  addRoadmap(roadmap: RoadmapFormValues): Promise<void>;
}

export class DefaultRoadmapStore implements RoadmapStore {
  private _roadmaps: Roadmap[] = [];
  private _selectedRoadmap: Roadmap | null = null;

  constructor () {
    makeAutoObservable(this);
  }

  public get selectedRoadmap (): Roadmap | null {
    return this._selectedRoadmap;
  }

  public set selectedRoadmap (value: Roadmap | null) {
    this._selectedRoadmap = value;
  }

  public get roadmaps (): Roadmap[] {
    return this._roadmaps;
  }

  public set roadmaps (value: Roadmap[]) {
    this._roadmaps = value;
  }

  public loadRoadmaps = async () => {
    try {
      const { data } = await roadmapService.getAll();
      this.setRoadmaps(data);
    } catch (error) {
      console.log(error);
    }
  };

  public selectRoadmap = async (id: number) => {
    const roadmap = this.roadmaps.find((x) => x.id === id);
    if (roadmap) {
      this.selectedRoadmap = roadmap;
      return;
    }
    try {
      const { data } = await roadmapService.get(id);
      this.selectedRoadmap = data;
    } catch (error) {
      console.log(error);
    }
  };

  public setRoadmaps = async (roadmaps: Roadmap[]) => {
    this.roadmaps = [...roadmaps];
  };

  public addRoadmap = async (values: RoadmapFormValues): Promise<void> => {
    try {
      const { data: id } = await roadmapService.add(values);
      const roadmap: Roadmap = {
        ...values,
        id: id,
        startsOn: new Date(values.startsOn),
        endsOn: values.endsOn ? new Date(values.endsOn) : null
      };
      this.roadmaps.push(roadmap);
      browserHistory.push(`${routes.roadmap.list}/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
}

export default new DefaultRoadmapStore();
