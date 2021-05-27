import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import customErrorMessages from '../../../app/validationSchemas/customErrorMessages';
import AddMilestone from '../AddMilestone';

describe('<AddMilestone />', () => {
  it('Should render form with name, description and endsOn input fields, with a submit button', async () => {
    const { getByLabelText, getByRole } = render(
      <Router history={browserHistory}>
        <AddMilestone roadmapId={1} />
      </Router>
    );
    await waitFor(() => {
      expect(
        getByLabelText(defaultDict.forms.inputs.name.labelText)
      ).toBeInTheDocument();
      expect(
        getByLabelText(defaultDict.forms.inputs.description.labelText)
      ).toBeInTheDocument();
      expect(
        getByLabelText(defaultDict.forms.inputs.endsOn.labelText)
      ).toBeInTheDocument();
      expect(
        getByRole('button', { name: defaultDict.forms.buttons.add.text })
      ).toBeInTheDocument();
    });
  });

  it('Should submit when form inputs contain text', async () => {
    const onSubmit = jest.fn();

    const { getByRole, getByLabelText } = render(
      <Router history={browserHistory}>
        <AddMilestone roadmapId={1} onSubmit={onSubmit} />
      </Router>
    );

    fireEvent.change(
      getByLabelText(defaultDict.forms.inputs.endsOn.labelText),
      {
        target: {
          value: format(new Date('2021-05-18'), 'yyyy-MM-dd')
        }
      }
    );
    fireEvent.change(getByLabelText(defaultDict.forms.inputs.name.labelText), {
      target: { value: 'TestMilestone' }
    });

    fireEvent.click(
      getByRole('button', { name: defaultDict.forms.buttons.add.text })
    );

    waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it('Should show error messages when user puts wrong input', async () => {
    const onSubmit = jest.fn();

    const { getByText, getByRole, getByLabelText } = render(
      <Router history={browserHistory}>
        <AddMilestone roadmapId={1} onSubmit={onSubmit} />
      </Router>
    );
    userEvent.click(getByLabelText(defaultDict.forms.inputs.name.labelText));
    userEvent.click(getByLabelText(defaultDict.forms.inputs.endsOn.labelText));

    userEvent.click(
      getByRole('button', { name: defaultDict.forms.buttons.add.text })
    );

    await waitFor(() =>
      expect(
        getByText(customErrorMessages.name.requiredMilestone)
      ).toBeInTheDocument()
    );
  });
});
