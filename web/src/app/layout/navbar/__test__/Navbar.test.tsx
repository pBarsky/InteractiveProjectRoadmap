import { render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import routes from '../../../common/routing/routes';
import { StoreProvider } from '../../../stores/store';
import Navbar from '../Navbar';
describe('<Navbar />', () => {
  it('Should render a nav', async () => {
    const { getByTestId } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <Navbar />
        </Router>
      </StoreProvider>
    );
    const rootLink = getByTestId('rootLink');
    expect(rootLink.closest('a')).toHaveAttribute('href', routes.common.home);
  });
});
