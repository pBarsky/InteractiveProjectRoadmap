import { FormikFormProps } from 'formik';
import React from 'react';
import styles from './Form.module.scss';

const Form = ({
	children,
	...props
}: FormikFormProps & React.FormHTMLAttributes<HTMLFormElement>) => {
	return (
		<form {...props} className={styles.form}>
			{children}
		</form>
	);
};

export default Form;
