import { mixed, object, SchemaOf } from 'yup';
import { ImageFormValues } from '../models/image';
import customErrorMessages from './customErrorMessages';

const maxFileSize = parseInt(process.env.REACT_APP_FILE_SIZE || '5000000');
const allowedExtensions = (process.env.REACT_APP_ALLOWED_EXTENSIONS || 'image/jpg image/png').split(
	' '
);

const logTest = (value: any): boolean => {
	return allowedExtensions.includes(value.type);
};

export const imageFormValuesSchema: SchemaOf<ImageFormValues> = object()
	.shape({
		file: mixed()
			.required(customErrorMessages.file.required)
			.test(
				'fileSize',
				customErrorMessages.file.size.fileTooLarge,
				(value: File) => value === null || (value && value.size <= maxFileSize)
			)
			.test(
				'fileFormat',
				customErrorMessages.file.format.unsupportedFormat,
				(value: File) => value === null || (value && logTest(value))
			)
	})
	.defined();
