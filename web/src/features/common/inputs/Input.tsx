import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
	icon?: IconProp;
	errorMessageAbsolutePosition?: boolean;
}

const Input = ({
	icon,
	errorMessageAbsolutePosition,
	...props
}: InputProps & FieldHookConfig<string>): JSX.Element => {
	const [field, meta] = useField(props);

	const inputWrapperClasses = (): string | undefined => {
		const classes = [props.className, icon ? styles.withIcon : undefined]
			.filter((x) => x)
			.join(' ');
		return classes.length > 0 ? classes : undefined;
	};

	const rowsNumber = (): number => {
		const value = (props.value ?? field.value) as string;
		return Math.floor(value.length / 40);
	};

	return (
		<div className={styles.input}>
			{props.type === 'textarea'
				? (
					<div className={inputWrapperClasses()}>
						<textarea
							{...field}
							value={props.value ?? field.value}
							disabled={props.disabled}
							id={props.id}
							rows={rowsNumber()}
						/>
						{icon && (
							<div className={styles.iconWrapper}>
								<FontAwesomeIcon icon={icon} className={styles.icon} />
							</div>
						)}
					</div>
				)
				: (
					<div className={inputWrapperClasses()}>
						<input
							{...field}
							value={props.value ?? field.value}
							disabled={props.disabled}
							type={props.type}
							id={props.id}
						/>
						{icon && (
							<div className={styles.iconWrapper}>
								<FontAwesomeIcon icon={icon} className={styles.icon} />
							</div>
						)}
					</div>
				)}
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

export default Input;
