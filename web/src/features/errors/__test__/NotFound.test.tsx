import { render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { User } from '../../../app/models/user';
import { store, StoreProvider } from '../../../app/stores/store';
import NotFound from '../NotFound';

describe('<NotFound />', () => {
	const user: User = {
		displayName: 'TestDisplayName',
		token: '',
		username: 'test'
	};

	it('Should render message', () => {
		const message = 'test message';
		store.authStore.user = user;
		const { getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<NotFound message={message} />
				</Router>
			</StoreProvider>
		);

		expect(getByText(message)).toBeInTheDocument();
	});

	it('Should render backButton to homepage when not authenticated', () => {
		const message = 'test message';
		store.authStore.user = null;
		const { getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<NotFound message={message} />
				</Router>
			</StoreProvider>
		);

		expect(getByText(defaultDict.forms.buttons.returnToHomepage.text)).toBeInTheDocument();
	});

	it('Should render backButton to dashboard when authenticated', () => {
		const message = 'test message';
		store.authStore.user = user;
		const { getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<NotFound message={message} />
				</Router>
			</StoreProvider>
		);

		expect(getByText(defaultDict.forms.buttons.returnToDashboard.text)).toBeInTheDocument();
	});
});
