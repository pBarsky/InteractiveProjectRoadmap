import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DefaultImageFormValues, ImageFormValues } from '../../app/models/image';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { imageFormValuesSchema } from '../../app/validationSchemas/uploadImageSchemas';
import UploadImageInnerForm from './UploadImageInnerForm';

const imageInitialValues: ImageFormValues = new DefaultImageFormValues();

interface UploadImageProps {
	hideForm: () => void;
	onSubmit?: (values: ImageFormValues, actions: FormikHelpers<ImageFormValues>) => Promise<void>;
}

const UploadImage = ({ onSubmit, hideForm }: UploadImageProps) => {
	const { roadmapStore } = useStore();

	const handleReset = () => {
		hideForm();
	};

	const handleSubmit = async (
		values: ImageFormValues,
		{ setErrors }: FormikHelpers<ImageFormValues>
	) => {
		try {
			const formData = new FormData();
			const selectedRoadmap = roadmapStore.selectedRoadmap!;

			formData.append('file', values.file as Blob);
			formData.append('roadmapId', selectedRoadmap!.id.toString());
			await roadmapStore.updateImage(formData);
			hideForm();
		} catch {
			setErrors({
				commonFormError: customErrorMessages.common.failedAddImage
			});
		}
	};

	return (
		<Formik
			initialValues={imageInitialValues}
			onSubmit={onSubmit ?? handleSubmit}
			onReset={handleReset}
			validateOnMount
			validationSchema={imageFormValuesSchema}
			component={UploadImageInnerForm}
		/>
	);
};

export default observer(UploadImage);
