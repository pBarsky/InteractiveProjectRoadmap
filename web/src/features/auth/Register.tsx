import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { browserHistory } from '../../App';
import { DefaultUserFormValues, UserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { userRegisterFormValuesSchema } from '../../app/validationSchemas/userSchemas';
import routes from '../common/routing/routes';
import RegisterInnerForm from './RegisterInnerForm';

const registerInitialValues: UserFormValues = new DefaultUserFormValues();

interface RegisterProps {
	onSubmit?: (values: UserFormValues, actions: FormikHelpers<UserFormValues>) => Promise<void>;
}

const Register = ({ onSubmit }: RegisterProps): JSX.Element => {
	const { authStore } = useStore();

	if (authStore.isLoggedIn) {
		browserHistory.push(routes.user.dashboard);
	}
	const handleSubmit = async (
		values: UserFormValues,
		{ setErrors }: FormikHelpers<UserFormValues>
	) => {
		try {
			values.displayName =
				values.username!.charAt(0).toUpperCase() + values.username!.slice(1);
			await authStore.register(values);
			browserHistory.push(routes.user.dashboard);
		} catch {
			setErrors({ commonFormError: customErrorMessages.common.failedLogin });
		}
	};
	return (
		<Formik
			initialValues={registerInitialValues}
			onSubmit={onSubmit ?? handleSubmit}
			validateOnMount
			validationSchema={userRegisterFormValuesSchema}
			component={RegisterInnerForm}
		/>
	);
};

export default Register;
