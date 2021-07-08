import { render } from '@testing-library/react';
import React from 'react';
import { browserHistory } from '../../../../App';
import { store } from '../../../../app/stores/store';
import { WithStoresAndRouter } from '../../../../setupTests';
import ProtectedRoute from '../ProtectedRoute';
import routes from '../routes';

describe('<ProtectedRoute />', () => {
	it('Should redirect to login page when user is not authorized', () => {
		render(
			<WithStoresAndRouter>
				<ProtectedRoute
					path='/'
					render={(): JSX.Element => <div data-testid='protectedDiv'></div>}
				/>
			</WithStoresAndRouter>
		);

		expect(browserHistory.location.pathname).toBe(routes.auth.login);
	});
	it('Should render desired component when user is authorized', () => {
		store.authStore.user = { displayName: 'test', token: '', username: 'test' };

		const { getByTestId } = render(
			<WithStoresAndRouter>
				<ProtectedRoute
					path='/'
					render={(): JSX.Element => <div data-testid='protectedDiv'>test</div>}
				/>
			</WithStoresAndRouter>
		);

		expect(getByTestId('protectedDiv')).toBeInTheDocument();
	});
});
