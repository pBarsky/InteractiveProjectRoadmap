import { AxiosPromise } from 'axios';
import { ApiClient, createApiClient } from '../api/apiClient';
import routes from '../common/routing/routes';
import { Milestone, MilestoneFormValues } from '../models/milestone';

export interface MilestoneService {
	get(id: number): AxiosPromise<Milestone>;
	getAll(idRoadmap: number): AxiosPromise<Milestone[]>;
	add(milestone: MilestoneFormValues): AxiosPromise<number>;
	update(milestone: Milestone): AxiosPromise<boolean>;
	delete(id: number): AxiosPromise<boolean>;
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

	update (milestone: Milestone): AxiosPromise<boolean> {
		return this.api.put<boolean>(routes.api.milestone.update, milestone);
	}

	delete (id: number): AxiosPromise<boolean> {
		return this.api.delete<boolean>(routes.api.milestone.delete(id));
	}
}

export default new DefaultMilestoneService(createApiClient());
