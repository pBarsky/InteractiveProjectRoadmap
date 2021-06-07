import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from '../../../../App';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import { store, StoreProvider } from '../../../../app/stores/store';
import routes from '../../../common/routing/routes';
import Navbar from '../Navbar';

describe('<UserNavMenu />', () => {
	it('Should contain login button when user is not authenticated', () => {
		const { getByTestId, getByText } = render(
			<StoreProvider>
				<Router history={browserHistory}>
					<Navbar />
				</Router>
			</StoreProvider>
		);

		const loginButton = getByText(defaultDict.forms.buttons.login.text);

		expect(getByTestId('menu')).toBeInTheDocument();
		expect(loginButton).toBeInTheDocument();
		expect(loginButton.closest('a')).toHaveAttribute('href', routes.auth.login);
	});

	it('Should render user dropdown when user is authenticated', () => {
		store.authStore.user = {
			displayName: 'TestDisplayName',
			token: '',
			username: 'test'
		};
		const { getByTestId, getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<Navbar />
				</Router>
			</StoreProvider>
		);
		expect(getByTestId('dropdown')).toBeInTheDocument();
		expect(getByText('TestDisplayName')).toBeInTheDocument();
	});

	it('User menu should contain dashboard, logout', () => {
		store.authStore.user = {
			displayName: 'TestDisplayName',
			token: '',
			username: 'test'
		};
		const { getByTestId, getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<Navbar />
				</Router>
			</StoreProvider>
		);

		userEvent.click(getByTestId('dropdown'));

		const dashboard = getByText(defaultDict.forms.buttons.dashboard.text);
		expect(dashboard).toBeInTheDocument();
		expect(dashboard.closest('a')).toHaveAttribute('href', routes.user.dashboard);
		expect(getByText(defaultDict.forms.buttons.logout.text)).toBeInTheDocument();
	});
});
