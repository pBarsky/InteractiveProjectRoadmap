import { AxiosPromise } from 'axios';
import { createApiClient, ApiClient } from '../api/apiClient';
import routes from '../common/routing/routes';
import { Roadmap, RoadmapFormValues } from '../models/roadmap';

export interface RoadmapService {
  get(id: number): AxiosPromise<Roadmap>;
  getAll(): AxiosPromise<Roadmap[]>;
  add(roadmap: RoadmapFormValues): AxiosPromise<number>;
}

export class DefaultRoadmapService implements RoadmapService {
  constructor (private api: ApiClient) {}

  get (id: number): AxiosPromise<Roadmap> {
    return this.api.get<Roadmap>(routes.api.roadmap.get(id));
  }

  getAll (): AxiosPromise<Roadmap[]> {
    return this.api.get<Roadmap[]>(routes.api.roadmap.getAll);
  }

  add (roadmap: RoadmapFormValues): AxiosPromise<number> {
    return this.api.post<number>(routes.api.roadmap.add, roadmap);
  }
}

export default new DefaultRoadmapService(createApiClient());
