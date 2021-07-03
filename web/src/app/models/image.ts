export interface ImageFormValues {
	file: File | null | '';
	roadmapId: number;
	commonFormError?: string;
}

export class DefaultImageFormValues implements ImageFormValues {
	public file: File | null | '' = '';
	public roadmapId = 0;
	public commonFormError?: string;
}
