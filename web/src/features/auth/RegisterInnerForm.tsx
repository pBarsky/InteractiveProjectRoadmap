import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { UserFormValues } from '../../app/models/user';
import Button from '../common/buttons/Button';
import Field from '../common/inputs/Field';
import Form from '../common/inputs/Form';
import styles from './RegisterInnerForm.module.scss';

const RegisterInnerForm = ({
	isValid,
	errors,
	handleSubmit,
	handleReset,
	isSubmitting
}: FormikProps<UserFormValues>) => {
	return (
		<Form onReset={handleReset} onSubmit={handleSubmit}>
			<Field
				label={defaultDict.forms.inputs.email.labelText}
				id={defaultDict.forms.inputs.email.name}
				name={defaultDict.forms.inputs.email.name}
				placeholder={defaultDict.forms.inputs.email.placeholder}
				required
				icon={faUser}
			/>
			<Field
				label={defaultDict.forms.inputs.username.labelText}
				id={defaultDict.forms.inputs.username.name}
				name={defaultDict.forms.inputs.username.name}
				placeholder={defaultDict.forms.inputs.username.placeholder}
				required
				icon={faUser}
			/>
			<Field
				label={defaultDict.forms.inputs.password.labelText}
				id={defaultDict.forms.inputs.password.name}
				name={defaultDict.forms.inputs.password.name}
				required
				placeholder={defaultDict.forms.inputs.password.placeholder}
				type='password'
				icon={faLock}
			/>
			{errors.commonFormError && (
				<div className={styles.errorMessage}>{errors.commonFormError}</div>
			)}
			<hr />
			<div className={styles.buttonsContainer}>
				<Button disabled={!isValid || isSubmitting} type='submit'>
					{defaultDict.forms.buttons.register.text}
				</Button>
			</div>
		</Form>
	);
};

export default RegisterInnerForm;
