import { AxiosPromise } from 'axios';
import { ApiClient, createApiClient } from '../api/apiClient';
import routes from '../common/routing/routes';
import { Roadmap } from '../models/roadmap';
import commonStore from '../stores/commonStore';

export interface RoadmapService {
  fetchRoadmaps(): AxiosPromise<Roadmap[]>;
  addRoadmap(roadmap: Roadmap): AxiosPromise<number>;
  fetchRoadmap(id: number): AxiosPromise<Roadmap>;
}

export class DefaultRoadmapService implements RoadmapService {
  constructor (private api: ApiClient) {}
  fetchRoadmaps (): AxiosPromise<Roadmap[]> {
    return this.api.get<Roadmap[]>(routes.api.roadmap.getAll);
  }

  addRoadmap (roadmap: Roadmap): AxiosPromise<number> {
    return this.api.post<number>(routes.api.roadmap.add, roadmap);
  }

  fetchRoadmap (id: number): AxiosPromise<Roadmap> {
    return this.api.get<Roadmap>(routes.api.roadmap.get(id));
  }
}

export default new DefaultRoadmapService(createApiClient(commonStore.token));
