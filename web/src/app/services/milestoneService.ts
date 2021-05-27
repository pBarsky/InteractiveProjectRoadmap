import { AxiosPromise } from 'axios';
import { createApiClient, ApiClient } from '../api/apiClient';
import routes from '../common/routing/routes';
import { Milestone, MilestoneFormValues } from '../models/milestone';

export interface MilestoneService {
  get(id: number): AxiosPromise<Milestone>;
  getAll(idRoadmap: number): AxiosPromise<Milestone[]>;
  add(milestone: MilestoneFormValues): AxiosPromise<number>;
}

export class DefaultMilestoneService implements MilestoneService {
  constructor (private api: ApiClient) {}

  get (id: number): AxiosPromise<Milestone> {
    return this.api.get<Milestone>(routes.api.milestone.get(id));
  }

  getAll (roadmapId: number): AxiosPromise<Milestone[]> {
    return this.api.get<Milestone[]>(routes.api.milestone.getAll(roadmapId));
  }

  add (milestone: MilestoneFormValues): AxiosPromise<number> {
    return this.api.post<number>(routes.api.milestone.add, milestone);
  }
}

export default new DefaultMilestoneService(createApiClient());
