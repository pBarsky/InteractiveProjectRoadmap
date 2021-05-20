import { ErrorMessage, FormikProps } from 'formik';
import { Form, Input } from 'formik-semantic-ui-react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  FormField,
  Label
} from 'semantic-ui-react';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import { UserFormValues } from '../../app/models/user';

const LoginInnerForm = ({
  isValid,
  errors,
  isSubmitting,
  touched
}: FormikProps<UserFormValues>) => {
  return (
    <Form
      loading={isSubmitting}
      layout='vertical'
      style={{
        width: 'clamp(300px, 50vw, 500px)',
        margin: 'auto',
        border: '1px solid rgba(0,0,0,.05)',
        boxShadow: '0 10px 25px rgba(0,0,0,.05)',
        padding: '20px'
      }}>
      <FormField required>
        <label id={defaultDict.forms.inputs.email.label}>
          {defaultDict.forms.inputs.email.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.email.label}
          name={defaultDict.forms.inputs.email.name}
          placeholder={defaultDict.forms.inputs.email.placeholder}
          required
          icon='user'
          iconPosition='left'
        />
        {touched.email && errors.email && <Label prompt>{errors.email}</Label>}
      </FormField>
      <FormField required>
        <label id={defaultDict.forms.inputs.password.label}>
          {defaultDict.forms.inputs.password.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.password.label}
          name={defaultDict.forms.inputs.password.name}
          required
          placeholder={defaultDict.forms.inputs.password.placeholder}
          type='password'
          icon='lock'
          iconPosition='left'
        />
        {touched.password && errors.password && (
          <Label prompt>{errors.password}</Label>
        )}
      </FormField>
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
        <Button basic color='black' as={Link} to={routes.auth.register}>
          or {defaultDict.forms.buttons.register.text}
        </Button>
        <Button
          color='black'
          disabled={!isValid}
          basic={!isValid}
          loading={isSubmitting}
          floated='right'
          type='submit'>
          {defaultDict.forms.buttons.login.text}
        </Button>
      </Container>
    </Form>
  );
};

export default LoginInnerForm;
