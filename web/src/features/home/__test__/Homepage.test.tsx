import { render } from '@testing-library/react';
import React from 'react';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import routes from '../../common/routing/routes';
import Homepage from '../Homepage';

describe('<Homepage />', () => {
	it('Should render login button when user is not authenticated', () => {
		const { getByRole } = render(
			<WithStoresAndRouter>
				<Homepage />
			</WithStoresAndRouter>
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
			<WithStoresAndRouter store={store}>
				<Homepage />
			</WithStoresAndRouter>
		);

		expect(browserHistory.location.pathname).toBe(routes.user.dashboard);
	});
});
