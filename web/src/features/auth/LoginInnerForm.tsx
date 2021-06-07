import { ErrorMessage, Field as FormikField, Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { Button, Container, Divider, Form, Input, Label } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { UserFormValues } from '../../app/models/user';
import LinkButton from '../common/buttons/LinkButton';
import routes from '../common/routing/routes';
import styles from './LoginInnerForm.module.scss';

const LoginInnerForm = ({
	isValid,
	errors,
	isSubmitting,
	touched,
	submitForm
}: FormikProps<UserFormValues>) => {
	return (
		<Form
			as={FormikForm}
			onSubmit={submitForm}
			loading={isSubmitting}
			layout='vertical'
			style={{
				width: 'clamp(300px, 50vw, 500px)',
				margin: 'auto',
				border: '1px solid rgba(0,0,0,.05)',
				boxShadow: '0 10px 25px rgba(0,0,0,.05)',
				padding: '20px'
			}}
		>
			<Form.Field required>
				<label htmlFor={defaultDict.forms.inputs.email.label}>
					{defaultDict.forms.inputs.email.labelText}
				</label>
				<FormikField
					as={Input}
					id={defaultDict.forms.inputs.email.name}
					name={defaultDict.forms.inputs.email.name}
					placeholder={defaultDict.forms.inputs.email.placeholder}
					required
					icon='user'
					iconPosition='left'
				/>
				{touched.email && errors.email && <Label prompt>{errors.email}</Label>}
			</Form.Field>
			<Form.Field required>
				<label htmlFor={defaultDict.forms.inputs.password.label}>
					{defaultDict.forms.inputs.password.labelText}
				</label>
				<FormikField
					as={Input}
					id={defaultDict.forms.inputs.password.name}
					name={defaultDict.forms.inputs.password.name}
					required
					placeholder={defaultDict.forms.inputs.password.placeholder}
					type='password'
					icon='lock'
					iconPosition='left'
				/>
				{touched.password && errors.password && <Label prompt>{errors.password}</Label>}
			</Form.Field>
			<ErrorMessage
				name='commonFormError'
				render={() => (
					<Label
						style={{ marginBottom: 10 }}
						basic
						color='red'
						content={errors.commonFormError}
					/>
				)}
			/>
			<Divider />
			<Container>
				<div className={styles.buttonsContainer}>
					<LinkButton to={routes.auth.register}>
						{defaultDict.forms.buttons.register.text}
					</LinkButton>

					<Button
						color='black'
						disabled={!isValid}
						basic={!isValid}
						loading={isSubmitting}
						floated='right'
						type='submit'
					>
						{defaultDict.forms.buttons.login.text}
					</Button>
				</div>
			</Container>
		</Form>
	);
};

export default LoginInnerForm;
