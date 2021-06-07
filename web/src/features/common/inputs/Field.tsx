import { FieldHookConfig } from 'formik';
import React from 'react';
import styles from './Field.module.scss';
import Input from './Input';

interface FieldProps {
	label: string;
	inputClassName?: string;
}

const Field = ({ label, inputClassName, ...props }: FieldProps & FieldHookConfig<string>) => {
	return (
		<div className={`${styles.field} ${props.className || ''}`}>
			<label htmlFor={props.id} className={props.required ? styles.required : ''}>
				{label}
			</label>
			<Input {...props} className={inputClassName} />
		</div>
	);
};

export default Field;