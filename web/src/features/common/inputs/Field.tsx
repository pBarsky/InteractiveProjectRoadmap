import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FieldHookConfig } from 'formik';
import React from 'react';
import styles from './Field.module.scss';
import Input from './Input';
import SelectInput from './SelectInput';

interface Option {
	value: any;
	label: string;
}

interface FieldProps {
	label: string;
	inputClassName?: string;
	textareaCharactersInARow?: number;
	icon?: IconProp;
	errorMessageAbsolutePosition?: boolean;
	options?: Option[];
}

const Field = ({
	label,
	inputClassName,
	options,
	...props
}: FieldProps & FieldHookConfig<string>): JSX.Element => {
	const inputElement =
		props.type === 'select' && options
			? (
				<SelectInput {...props} className={inputClassName} options={options} />
			)
			: (
				<Input {...props} className={inputClassName} />
			);

	return (
		<div className={`${styles.field} ${props.className || ''}`}>
			<label htmlFor={props.id} className={props.required ? styles.required : ''}>
				{label}
			</label>
			{inputElement}
		</div>
	);
};

export default Field;
