import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { browserHistory } from '../../../../App';
import LinkButton from '../LinkButton';

describe('<linkButton />', () => {
  it('Should go to other page when clicked', async () => {
    const otherPage = '/otherPage';
    browserHistory.push(otherPage);
    browserHistory.push('/');
    browserHistory.push('/');
    const { getByRole } = render(
      <Router history={browserHistory}>
        <LinkButton to={otherPage} />
      </Router>
    );

    await userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(browserHistory.location.pathname).toBe(otherPage);
    });
  });
});
