import { object, SchemaOf, string } from 'yup'
import { UserFormValues } from '../models/user'
import validationErrorMessages from './customErrorMessages'

export const userLoginFormValuesSchema: SchemaOf<UserFormValues> = object()
  .shape({
    email: string().required(validationErrorMessages.email.required).email(),
    displayName: string().notRequired(),
    password: string()
      .required(validationErrorMessages.password.required)
      .min(8)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: validationErrorMessages.password.complex
      }),
    username: string().notRequired()
  })
  .defined()

export const userRegisterFormValuesSchema: SchemaOf<UserFormValues> = object()
  .shape({
    email: string().required(validationErrorMessages.email.required).email(),
    displayName: string().notRequired(),
    password: string()
      .required(validationErrorMessages.password.required)
      .min(8)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: validationErrorMessages.password.complex
      }),
    username: string().required(validationErrorMessages.username.required)
  })
  .defined()
