import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from './Button.module.scss';

type Sizes = 'small' | 'medium' | 'huge';
interface ButtonProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	outlined?: boolean;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	size?: Sizes;
}

const Button = ({
	outlined = false,
	className,
	children,
	type = 'button',
	disabled = false,
	size = 'medium',
	...props
}: ButtonProps): JSX.Element => {
	const getSizeClass = (size: string): string => {
		switch (size) {
		case 'huge':
			return styles.huge;
		case 'medium':
			return styles.medium;
		case 'small':
			return styles.small;
		}
		return styles.medium;
	};

	const sizeClass = getSizeClass(size);
	const classNames = [
		styles.button,
		sizeClass,
		className || '',
		outlined ? styles.outlined : null
	].join(' ');
	return (
		<button {...props} type={type} className={classNames} disabled={disabled}>
			{children}
		</button>
	);
};

export default Button;
