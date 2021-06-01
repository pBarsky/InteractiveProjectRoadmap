import { makeAutoObservable, runInAction } from 'mobx';
import { browserHistory } from '../../App';
import routes from '../common/routing/routes';
import defaultDict from '../dictionaries/defaultDict';
import { Roadmap, RoadmapFormValues } from '../models/roadmap';
import roadmapService from '../services/roadmapService';

export interface RoadmapStore {
    roadmaps: Roadmap[];
    selectedRoadmap: Roadmap | null;
    loading: boolean;
    loadRoadmaps(): Promise<void>;
    loadRoadmap(id: number): Promise<void>;
    addRoadmap(roadmap: RoadmapFormValues): Promise<void>;
    updateRoadmap(roadmap: Roadmap): Promise<void>;
    deleteRoadmap(id: number): Promise<void>;
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
        const { data } = await roadmapService.getAll();
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
        const { data } = await roadmapService.get(id);
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

    addRoadmap = async (values: RoadmapFormValues): Promise<void> => {
      try {
        const { data: id } = await roadmapService.add(values);
        const roadmap: Roadmap = {
          ...values,
          id: id,
          startsOn: new Date(values.startsOn),
          endsOn: values.endsOn ? new Date(values.endsOn) : null
        };
        runInAction(() => {
          this.roadmaps.push(roadmap);
        });
        browserHistory.push(`${routes.roadmap.list}/${id}`);
      } catch (error) {
        console.error(error);
      }
    };

    updateRoadmap = async (values: Roadmap): Promise<void> => {
      this.loading = true;
      try {
        const { data } = await roadmapService.update(values);
        if (!data) {
          throw new Error(defaultDict.errors.roadmap.failedEdit);
        }
        this.selectedRoadmap = { ...values };
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    };

    setRoadmap = (roadmap: Roadmap) => {
      const index = this.roadmaps.findIndex((x) => x.id === roadmap.id);
      if (index === -1) {
        return;
      }
      const newRoadmaps = [...this.roadmaps];
      newRoadmaps[index] = { ...roadmap };
      this.setRoadmaps(newRoadmaps);
    };

    deleteRoadmap = async (id: number): Promise<void> => {
      this.loading = true;
      try {
        const { data } = await roadmapService.delete(id);
        if (!data) {
          throw new Error(defaultDict.errors.roadmap.failedDelete);
        }
        this.selectedRoadmap = null;
        this.roadmaps = this.roadmaps.filter((x) => x.id !== id);
        browserHistory.push(routes.user.dashboard);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
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
