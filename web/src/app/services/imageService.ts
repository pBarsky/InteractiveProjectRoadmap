import { AxiosPromise } from 'axios';
import routes from '../../features/common/routing/routes';
import { ApiClient, createApiClient } from '../api/apiClient';

export interface ImageService {
	add(formdata: FormData): AxiosPromise<string>;
	update(formdata: FormData): AxiosPromise<string>;
	delete(roadmapId: number): AxiosPromise<boolean>;
}

export class DefaultImageService implements ImageService {
	public constructor (private api: ApiClient) {}

	public add (formdata: FormData): AxiosPromise<string> {
		return this.api.post<string>(routes.api.image.add, formdata, {
			headers: { 'content-type': 'multipart/form-data' }
		});
	}

	public update (formdata: FormData): AxiosPromise<string> {
		return this.api.put<string>(routes.api.image.update, formdata, {
			headers: { 'content-type': 'multipart/form-data' }
		});
	}

	public delete (roadmapId: number): AxiosPromise<boolean> {
		return this.api.delete<boolean>(routes.api.image.delete(roadmapId));
	}
}

export default new DefaultImageService(createApiClient());
