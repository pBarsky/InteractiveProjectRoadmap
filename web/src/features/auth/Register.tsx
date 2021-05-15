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
import { userRegisterFormValuesSchema } from '../../app/validationSchemas/userSchemas'

// forma na register, po zalogowaniu przenosi na dashboard usera z jego danymi (jakos ladnie pokazane, jakkolwiek)

const registerInitialValues: UserFormValues = {
  email: '',
  password: '',
  displayName: '',
  username: '',
  commonFormError: ''
}

const InnerForm = ({
  isValid,
  isSubmitting,
  touched,
  errors
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
        <label id='email'>Email</label>
        <Input
          name='email'
          aria-labelledby='email'
          placeholder='Email'
          required
          icon='user'
          iconPosition='left'
        />
        {touched.email && errors.email && <Label prompt>{errors.email}</Label>}
      </FormField>
      <FormField required>
        <label id='username'>Username</label>
        <Input
          name='username'
          aria-labelledby='username'
          placeholder='Username'
          required
          icon='user'
          iconPosition='left'
        />
        {touched.username && errors.username && (
          <Label prompt>{errors.username}</Label>
        )}
      </FormField>
      <FormField required>
        <label id='password'>Password</label>
        <Input
          name='password'
          aria-labelledby='password'
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
          Register
        </Button>
        <Button basic floated='right' as={Link} to='/login'>
          or Login
        </Button>
      </Container>
    </Form>
  )
}

interface Props {
  onSubmit?: (
    values: UserFormValues,
    actions: FormikHelpers<UserFormValues>
  ) => Promise<void>
}

const Register = ({ onSubmit }: Props) => {
  const { userStore } = useStore()

  const handleSubmit = async (
    values: UserFormValues,
    { setErrors }: FormikHelpers<UserFormValues>
  ) => {
    try {
      values.displayName =
        values.username!.charAt(0).toUpperCase() + values.username!.slice(1)
      await userStore.register(values)
      browserHistory.push(routes.user.dashboard)
    } catch {
      setErrors({ commonFormError: 'Invalid email or password.' })
    }
  }
  return (
    <Formik
      initialValues={registerInitialValues}
      onSubmit={onSubmit ?? handleSubmit}
      validateOnMount
      validationSchema={userRegisterFormValuesSchema}
      component={InnerForm}
    />
  )
}

export default observer(Register)
