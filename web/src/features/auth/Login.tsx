import { ErrorMessage, Formik, FormikHelpers, FormikProps } from 'formik'
import { Form, Input } from 'formik-semantic-ui-react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, FormField, Label } from 'semantic-ui-react'
import routes from '../../app/common/routing/routes'
import { browserHistory } from '../../app/layout/App'
import { UserFormValues } from '../../app/models/user'
import { useStore } from '../../app/stores/store'
import { userLoginFormValuesSchema } from '../../app/validationSchemas/userSchemas'

// forma na logowanie, po zalogowaniu przenosi na dashboard usera z jego danymi (jakos ladnie pokazane, jakkolwiek)

const loginInitialValues: UserFormValues = {
  email: '',
  password: '',
  commonFormError: ''
}

const InnerForm = ({
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
        <label>Email</label>
        <Input
          name='email'
          placeholder='Email'
          required
          icon='user'
          iconPosition='left'
        />
        {touched.email && errors.email && (
          <Label prompt pointing>
            {errors.email}
          </Label>
        )}
      </FormField>
      <FormField required>
        <label>Password</label>
        <Input
          name='password'
          required
          placeholder='Password'
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
      <Container>
        <Button
          color='black'
          disabled={!isValid}
          loading={isSubmitting}
          type='submit'>
          Login
        </Button>
        <Button
          basic
          color='black'
          floated='right'
          as={Link}
          to={routes.auth.register}>
          or Register
        </Button>
      </Container>
    </Form>
  )
}

const Login = () => {
  const { userStore } = useStore()

  const handleSubmit = async (
    values: UserFormValues,
    { setErrors }: FormikHelpers<UserFormValues>
  ) => {
    try {
      await userStore.login(values)
      browserHistory.push(routes.user.dashboard)
    } catch {
      setErrors({ commonFormError: 'Invalid email or password.' })
    }
  }

  return (
    <Formik
      initialValues={loginInitialValues}
      onSubmit={handleSubmit}
      validateOnMount
      validationSchema={userLoginFormValuesSchema}
      component={InnerForm}
    />
  )
}

export default observer(Login)
