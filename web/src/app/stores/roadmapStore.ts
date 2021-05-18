import { makeAutoObservable } from 'mobx';
import { Roadmap } from '../models/roadmap';
import roadmapService from '../services/roadmapService';

export interface RoadmapStore {
  roadmaps: Roadmap[];
  selectedRoadmap: Roadmap | null;
  isLoading: boolean;
  loadRoadmaps(): Promise<void>;
  loadRoadmap(id: number): Promise<void>;
}

export class DefaultRoadmapStore implements RoadmapStore {
  private _roadmaps: Roadmap[] = [];
  private _selectedRoadmap: Roadmap | null = null;
  private _isLoading: boolean = true;

  constructor () {
    makeAutoObservable(this);
  }

  public get isLoading (): boolean {
    return this._isLoading;
  }

  public set isLoading (value: boolean) {
    this._isLoading = value;
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
      this.isLoading = true;
      const { data } = await roadmapService.fetchRoadmaps();
      this.setRoadmaps(data);
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  loadRoadmap = async (id: number) => {
    const roadmap: Roadmap | undefined = this.roadmaps.find((x) => x.id === id);
    if (roadmap) {
      this.selectedRoadmap = roadmap;
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    try {
      const { data } = await roadmapService.fetchRoadmap(id);
      this.roadmaps.push(data);
      this.selectedRoadmap = data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  };

  setRoadmaps = (roadmaps: Roadmap[]) => {
    this.roadmaps = [...roadmaps];
  };
}

export default new DefaultRoadmapStore();
