import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
	outlined?: boolean;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
}

const Button = ({
	outlined = false,
	className,
	children,
	type = 'button',
	disabled = false,
	...props
}: ButtonProps & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
	return (
		<button
			{...props}
			type={type}
			className={`${styles.button} ${className} ${outlined ? styles.outlined : null}`}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
