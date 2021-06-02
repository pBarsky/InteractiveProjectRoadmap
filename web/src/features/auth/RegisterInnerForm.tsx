import { ErrorMessage, Field as FormikField, Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { Button, Container, Divider, Form, Input, Label } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { UserFormValues } from '../../app/models/user';

const RegisterInnerForm = ({
	isValid,
	isSubmitting,
	touched,
	errors,
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
				<label htmlFor={defaultDict.forms.inputs.username.label}>
					{defaultDict.forms.inputs.username.labelText}
				</label>
				<FormikField
					as={Input}
					id={defaultDict.forms.inputs.username.name}
					name={defaultDict.forms.inputs.username.name}
					placeholder={defaultDict.forms.inputs.username.placeholder}
					required
					icon='user'
					iconPosition='left'
				/>
				{touched.username && errors.username && <Label prompt>{errors.username}</Label>}
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
				<Button
					floated='right'
					color='black'
					disabled={!isValid}
					basic={!isValid}
					loading={isSubmitting}
					type='submit'
				>
					{defaultDict.forms.buttons.register.text}
				</Button>
			</Container>
		</Form>
	);
};

export default RegisterInnerForm;
