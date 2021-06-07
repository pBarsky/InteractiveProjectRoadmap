import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Input.module.scss';

interface InputProps {
	icon?: IconProp;
}

const Input = ({ icon, ...props }: InputProps & FieldHookConfig<string>): JSX.Element => {
	const [field, meta] = useField(props);

	return (
		<div className={styles.input}>
			{props.type === 'textarea'
				? (
					<TextareaAutosize
						className={props.className}
						disabled={props.disabled}
						{...field}
						id={props.id}
					/>
				)
				: (
					<div className={`${props.className || ''} ${icon ? styles.withIcon : ''}`}>
						<input disabled={props.disabled} {...field} type={props.type} id={props.id} />
						{icon && (
							<div className={styles.iconWrapper}>
								<FontAwesomeIcon icon={icon} className={styles.icon} />
							</div>
						)}
					</div>
				)}
			{meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
		</div>
	);
};

export default Input;
