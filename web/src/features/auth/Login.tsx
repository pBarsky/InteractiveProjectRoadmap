import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import { DefaultUserFormValues, UserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { userLoginFormValuesSchema } from '../../app/validationSchemas/userSchemas';
import LoginInnerForm from './LoginInnerForm';

// forma na logowanie, po zalogowaniu przenosi na dashboard usera z jego danymi (jakos ladnie pokazane, jakkolwiek)

const loginInitialValues: UserFormValues = new DefaultUserFormValues();

interface LoginProps {
	onSubmit?: (values: UserFormValues, actions: FormikHelpers<UserFormValues>) => Promise<void>;
}

const Login = ({ onSubmit }: LoginProps) => {
	const { authStore } = useStore();

	if (authStore.isLoggedIn) {
		browserHistory.push(routes.user.dashboard);
	}

	const handleSubmit = async (
		values: UserFormValues,
		{ setErrors }: FormikHelpers<UserFormValues>
	) => {
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

export default observer(Login);
