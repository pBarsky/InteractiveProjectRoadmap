import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Router } from 'react-router-dom'
import routes from '../../../app/common/routing/routes'
import { browserHistory } from '../../../app/layout/App'
import customErrorMessages from '../../../app/validationSchemas/customErrorMessages'
import Login from '../Login'

describe('<Login />', () => {
  it('Should render form with email and password input fields, with a submit button and a button with link to register', () => {
    const { getByLabelText, getByRole } = render(
      <Router history={browserHistory}>
        <Login />
      </Router>
    )
    expect(getByLabelText(/email/i)).toBeInTheDocument()
    expect(getByLabelText(/password/i)).toBeInTheDocument()
    expect(getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(
      getByRole('button', { name: /register/i }).closest('a')
    ).toHaveAttribute('href', routes.auth.register)
  })

  it('should submit when form inputs contain text', async () => {
    const onSubmit = jest.fn()

    const { getByRole, queryByText, getByLabelText } = render(
      <Router history={browserHistory}>
        <Login onSubmit={onSubmit} />
      </Router>
    )

    userEvent.type(getByLabelText(/email/i), 'taken@test.com')
    userEvent.type(getByLabelText(/password/i), 'Randompassword123@')

    userEvent.click(getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)

      expect(
        queryByText(customErrorMessages.email.required)
      ).not.toBeInTheDocument()
      expect(
        queryByText(customErrorMessages.password.required)
      ).not.toBeInTheDocument()
    })
  })

  it('Should show error messages when user puts wrong input', async () => {
    const onSubmit = jest.fn()

    const { getByText, getByRole, getByLabelText } = render(
      <Router history={browserHistory}>
        <Login onSubmit={onSubmit} />
      </Router>
    )

    userEvent.click(getByLabelText(/email/i))
    userEvent.click(getByLabelText(/password/i))

    userEvent.click(getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(getByText(customErrorMessages.email.required)).toBeInTheDocument()
      expect(
        getByText(customErrorMessages.password.required)
      ).toBeInTheDocument()
    })
  })
})
