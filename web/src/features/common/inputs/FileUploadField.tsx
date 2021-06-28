import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import styles from './FileUploadField.module.scss';

interface UploadFieldProps {
	label: string;
	inputClassName?: string;
	afterOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
	icon?: IconProp;
}

const UploadField = ({
	label,
	setFieldValue,
	afterOnChange,
	...props
}: UploadFieldProps & FieldHookConfig<string>): JSX.Element => {
	const [field, meta] = useField(props);
	const loggingOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (afterOnChange) {
			afterOnChange(event);
		}
		setFieldValue(props.name, event?.currentTarget?.files![0]);
		console.debug(0 ?? field.value);
	};

	const acceptedFiles = (process.env.REACT_APP_ALLOWED_EXTENSIONS || 'image/*').replace(
		/ /g,
		','
	);

	return (
		<div className={`${styles.field} ${props.className || ''}`}>
			<label htmlFor={props.id} className={props.required ? styles.required : ''}>
				{label}
			</label>
			<input
				disabled={props.disabled}
				type='file'
				id={props.id}
				onChange={loggingOnChange}
				accept={acceptedFiles}
			/>
			{meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
		</div>
	);
};

export default UploadField;
