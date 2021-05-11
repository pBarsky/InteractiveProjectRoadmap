import { object, SchemaOf, string } from 'yup'
import { UserFormValues } from '../models/user'

export const userLoginFormValuesSchema: SchemaOf<UserFormValues> = object()
  .shape({
    email: string().required('required').email(),
    displayName: string().notRequired(),
    password: string()
      .required('required')
      .min(8)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter and one number'
      }),
    username: string().notRequired()
  })
  .defined()

export const userRegisterFormValuesSchema: SchemaOf<UserFormValues> = object()
  .shape({
    email: string().required('required').email(),
    displayName: string().notRequired(),
    password: string()
      .required('required')
      .min(8)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter and one number'
      }),
    username: string().required()
  })
  .defined()
