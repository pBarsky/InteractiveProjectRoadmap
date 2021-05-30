import { render } from '@testing-library/react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import routes from '../../../app/common/routing/routes';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { store, StoreProvider } from '../../../app/stores/store';
import Homepage from '../Homepage';

describe('<Homepage />', () => {
  it('Should render login button when user is not authenticated', () => {
    const { getByRole } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <Homepage />
        </Router>
      </StoreProvider>
    );

    expect(
      getByRole('button', {
        name: defaultDict.forms.buttons.login.text
      }).closest('a')
    ).toHaveAttribute('href', routes.auth.login);
  });
  it('Should redirect to dashboard when user is authenticated', () => {
    store.authStore.user = {
      displayName: 'TestDisplayName',
      token: '',
      username: 'test'
    };

    render(
      <StoreProvider store={store}>
        <Router history={browserHistory}>
          <Homepage />
        </Router>
      </StoreProvider>
    );

    expect(browserHistory.location.pathname).toBe(routes.user.dashboard);
  });
});
