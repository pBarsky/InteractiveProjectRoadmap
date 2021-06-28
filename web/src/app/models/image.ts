export interface ImageFormValues {
    file: File | null | '';
    roadmapId: number;
    commonFormError?: string;
}

export class DefaultImageFormValues implements ImageFormValues {
	file: File | null | '' = '';
    roadmapId: number = 0;
    commonFormError?: string;
}
