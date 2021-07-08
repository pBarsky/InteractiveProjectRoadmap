import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import { store } from '../../../../app/stores/store';
import { WithStoresAndRouter } from '../../../../setupTests';
import routes from '../../../common/routing/routes';
import Navbar from '../Navbar';

describe('<UserNavMenu />', () => {
	it('Should contain login button when user is not authenticated', () => {
		const { getByText } = render(
			<WithStoresAndRouter>
				<Navbar />
			</WithStoresAndRouter>
		);

		const loginButton = getByText(defaultDict.forms.buttons.login.text);

		expect(loginButton).toBeInTheDocument();
		expect(loginButton.closest('a')).toHaveAttribute('href', routes.auth.login);
	});

	it('Should render user dropdown when user is authenticated', () => {
		store.authStore.user = {
			displayName: 'TestDisplayName',
			token: '',
			username: 'test'
		};
		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<Navbar />
			</WithStoresAndRouter>
		);
		expect(getByText('TestDisplayName')).toBeInTheDocument();
	});

	it('User menu should contain dashboard, logout', () => {
		const user = {
			displayName: 'TestDisplayName',
			token: '',
			username: 'test'
		};
		store.authStore.user = { ...user };
		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<Navbar />
			</WithStoresAndRouter>
		);

		userEvent.click(getByText(user.displayName));

		const dashboard = getByText(defaultDict.forms.buttons.dashboard.text);
		expect(dashboard).toBeInTheDocument();
		expect(dashboard.closest('a')).toHaveAttribute('href', routes.user.dashboard);
		expect(getByText(defaultDict.forms.buttons.logout.text)).toBeInTheDocument();
	});
});
