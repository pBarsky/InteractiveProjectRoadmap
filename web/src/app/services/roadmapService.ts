import { AxiosPromise } from 'axios';
import routes from '../../features/common/routing/routes';
import { ApiClient, createApiClient } from '../api/apiClient';
import { Roadmap, RoadmapFormValues } from '../models/roadmap';

export interface RoadmapService {
	get(id: number): AxiosPromise<Roadmap>;
	getAll(): AxiosPromise<Roadmap[]>;
	add(roadmap: RoadmapFormValues): AxiosPromise<number>;
	update(roadmap: Roadmap): AxiosPromise<boolean>;
	delete(id: number): AxiosPromise<boolean>;
}

export class DefaultRoadmapService implements RoadmapService {
	public constructor (private api: ApiClient) {}

	public get (id: number): AxiosPromise<Roadmap> {
		return this.api.get<Roadmap>(routes.api.roadmap.get(id));
	}

	public getAll (): AxiosPromise<Roadmap[]> {
		return this.api.get<Roadmap[]>(routes.api.roadmap.getAll);
	}

	public add (roadmap: RoadmapFormValues): AxiosPromise<number> {
		return this.api.post<number>(routes.api.roadmap.add, roadmap);
	}

	public update (roadmap: Roadmap): AxiosPromise<boolean> {
		return this.api.put<boolean>(routes.api.roadmap.update, roadmap);
	}

	public delete (id: number): AxiosPromise<boolean> {
		return this.api.delete<boolean>(routes.api.roadmap.delete(id));
	}
}

export default new DefaultRoadmapService(createApiClient());
