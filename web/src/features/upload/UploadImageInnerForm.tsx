import { FormikProps } from 'formik';
import React, { useState } from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { ImageFormValues } from '../../app/models/image';
import Button from '../common/buttons/Button';
import FileUploadField from '../common/inputs/FileUploadField';
import Form from '../common/inputs/Form';
import styles from './UploadImageInnerForm.module.scss';

const UploadImageInnerForm = ({
	setFieldValue,
	handleSubmit,
	handleReset
}: FormikProps<ImageFormValues>) => {
	const [file, setFile] = useState<File | null>(null);
	const fileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFile(event?.currentTarget?.files![0]);
	};

	const onReset = () => {
		setFile(null);
		handleReset();
	};

	return (
		<Form onSubmit={handleSubmit} onReset={onReset} className={styles.uploadImageForm}>
			{file && (
				<div className={styles.wrapper}>
					<img src={URL.createObjectURL(file)} alt={file?.name} />
				</div>
			)}
			<FileUploadField
				name={defaultDict.forms.inputs.upload.name}
				setFieldValue={setFieldValue}
				label={defaultDict.forms.inputs.upload.label}
				afterOnChange={fileHandler}
			/>
			<div className={styles.buttons}>
				<Button className={styles.imageButton} type='submit'>
					{defaultDict.forms.buttons.save.text}
				</Button>
				<Button outlined className={styles.imageButton} type='reset'>
					{defaultDict.forms.buttons.cancel.text}
				</Button>
			</div>
		</Form>
	);
};

export default UploadImageInnerForm;
