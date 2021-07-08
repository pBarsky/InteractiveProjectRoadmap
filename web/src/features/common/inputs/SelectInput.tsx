import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import { StatusSelectOption } from '../../../app/models/milestone';
import styles from './SelectInput.module.scss';

interface SelectInputProps {
	errorMessageAbsolutePosition?: boolean;
	options: StatusSelectOption[];
}

const SelectInput = ({
	errorMessageAbsolutePosition,
	options,
	className,
	...props
}: SelectInputProps & FieldHookConfig<string>): JSX.Element => {
	const [field, meta] = useField(props);

	return (
		<div className={styles.input}>
			<div className={className}>
				<select {...field} disabled={props.disabled} id={props.id}>
					{options.map((x) => (
						<option key={`${x.value}${x.label}`} value={x.value} label={x.label} />
					))}
				</select>
			</div>
			{meta.touched && meta.error && (
				<div
					className={`${styles.errorMessage} ${
						errorMessageAbsolutePosition ? styles.absolute : ''
					}`}
				>
					{meta.error}
				</div>
			)}
		</div>
	);
};

export default SelectInput;
