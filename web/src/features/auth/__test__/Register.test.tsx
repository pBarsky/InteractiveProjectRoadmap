import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../App';
import routes from '../../../app/common/routing/routes';
import defaultDict from '../../../app/dictionaries/defaultDict';
import customErrorMessages from '../../../app/validationSchemas/customErrorMessages';
import Register from '../Register';

describe('<Register />', () => {
  it('Should render form with email and password input fields, with a submit button and a button with link to login', () => {
    const { getByLabelText, getByRole } = render(
      <Router history={browserHistory}>
        <Register />
      </Router>
    );
    expect(
      getByLabelText(defaultDict.forms.inputs.email.labelText)
    ).toBeInTheDocument();
    expect(
      getByLabelText(defaultDict.forms.inputs.password.labelText)
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: defaultDict.forms.buttons.register.text })
    ).toBeInTheDocument();
    expect(
      getByRole('button', {
        name: new RegExp(defaultDict.forms.buttons.login.text, 'i')
      }).closest('a')
    ).toHaveAttribute('href', routes.auth.login);
  });

  it('should submit when form inputs contain text', async () => {
    const onSubmit = jest.fn();

    const { getByRole, queryByText, getByLabelText } = render(
      <Router history={browserHistory}>
        <Register onSubmit={onSubmit} />
      </Router>
    );

    userEvent.type(
      getByLabelText(defaultDict.forms.inputs.email.labelText),
      'taken@test.com'
    );
    userEvent.type(
      getByLabelText(defaultDict.forms.inputs.username.labelText),
      'taken'
    );
    userEvent.type(
      getByLabelText(defaultDict.forms.inputs.password.labelText),
      'Randompassword123@'
    );

    userEvent.click(
      getByRole('button', { name: defaultDict.forms.buttons.register.text })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);

      expect(
        queryByText(customErrorMessages.email.required)
      ).not.toBeInTheDocument();
      expect(
        queryByText(customErrorMessages.password.required)
      ).not.toBeInTheDocument();
      expect(
        queryByText(customErrorMessages.username.required)
      ).not.toBeInTheDocument();
    });
  });

  it('Should show error messages when user puts wrong input', async () => {
    const onSubmit = jest.fn();

    const { getByText, getByRole, getByLabelText } = render(
      <Router history={browserHistory}>
        <Register onSubmit={onSubmit} />
      </Router>
    );

    userEvent.click(getByLabelText(defaultDict.forms.inputs.email.labelText));
    userEvent.click(
      getByLabelText(defaultDict.forms.inputs.username.labelText)
    );
    userEvent.click(
      getByLabelText(defaultDict.forms.inputs.password.labelText)
    );

    userEvent.click(
      getByRole('button', { name: defaultDict.forms.buttons.register.text })
    );

    await waitFor(() => {
      expect(getByText(customErrorMessages.email.required)).toBeInTheDocument();
      expect(
        getByText(customErrorMessages.username.required)
      ).toBeInTheDocument();
      expect(
        getByText(customErrorMessages.password.required)
      ).toBeInTheDocument();
    });
  });
});
