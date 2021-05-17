import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import { DefaultUserFormValues, UserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/store';
import { userRegisterFormValuesSchema } from '../../app/validationSchemas/userSchemas';
import RegisterInnerForm from './RegisterInnerForm';

const registerInitialValues: UserFormValues = new DefaultUserFormValues();

interface RegisterProps {
  onSubmit?: (
    values: UserFormValues,
    actions: FormikHelpers<UserFormValues>
  ) => Promise<void>;
}

const Register = ({ onSubmit }: RegisterProps) => {
  const { authStore: userStore } = useStore();

  const handleSubmit = async (
    values: UserFormValues,
    { setErrors }: FormikHelpers<UserFormValues>
  ) => {
    try {
      values.displayName =
        values.username!.charAt(0).toUpperCase() + values.username!.slice(1);
      await userStore.register(values);
      browserHistory.push(routes.user.dashboard);
    } catch {
      setErrors({ commonFormError: 'Invalid email or password.' });
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

export default observer(Register);
