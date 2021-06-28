import { mixed, object, SchemaOf } from 'yup';
import { ImageFormValues } from '../models/image';
import customErrorMessages from './customErrorMessages';

const maxFileSize = parseInt(process.env.REACT_APP_FILE_SIZE || '5000000');
const allowedExtensions = (process.env.REACT_APP_ALLOWED_EXTENSIONS || 'image/jpg image/png').split(' ');

const logTest = (value: any): boolean => {
	return allowedExtensions.includes(value.type);
};

export const imageFormValuesSchema: SchemaOf<ImageFormValues> = object()
	.shape({
		file: mixed()
			.required('A file is required')
			.test(
				'fileSize',
				customErrorMessages.fileSize.fileTooLarge,
				(value: File) => value === null || (value && value.size <= maxFileSize)
			)
			.test(
				'fileFormat',
				customErrorMessages.fileFormat.unsupportedFormat,
				(value: File) => value === null || (value && logTest(value))
			)
	})
	.defined();
