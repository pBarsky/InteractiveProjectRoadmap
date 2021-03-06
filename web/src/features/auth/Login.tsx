import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { browserHistory } from '../../App';
import { DefaultUserFormValues, UserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { userLoginFormValuesSchema } from '../../app/validationSchemas/userSchemas';
import routes from '../common/routing/routes';
import LoginInnerForm from './LoginInnerForm';

// forma na logowanie, po zalogowaniu przenosi na dashboard usera z jego danymi (jakos ladnie pokazane, jakkolwiek)

const loginInitialValues: UserFormValues = new DefaultUserFormValues();

interface LoginProps {
	onSubmit?: (values: UserFormValues, actions: FormikHelpers<UserFormValues>) => Promise<void>;
}

const Login = ({ onSubmit }: LoginProps): JSX.Element => {
	const { authStore } = useStore();

	if (authStore.isLoggedIn) {
		browserHistory.push(routes.user.dashboard);
	}

	const handleSubmit = async (
		values: UserFormValues,
		{ setErrors }: FormikHelpers<UserFormValues>
	): Promise<void> => {
		try {
			await authStore.login(values);
			browserHistory.push(routes.user.dashboard);
		} catch {
			setErrors({ commonFormError: customErrorMessages.common.failedLogin });
		}
	};

	return (
		<Formik
			initialValues={loginInitialValues}
			onSubmit={onSubmit ?? handleSubmit}
			validateOnMount
			validationSchema={userLoginFormValuesSchema}
			component={LoginInnerForm}
		/>
	);
};

export default Login;
