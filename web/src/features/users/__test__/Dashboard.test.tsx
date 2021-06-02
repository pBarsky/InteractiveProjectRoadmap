import { render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import { store, StoreProvider } from '../../../app/stores/store';
import Dashboard from '../Dashboard';

describe('<Dashboard />', () => {
	it('Should display user displayName', () => {
		const userDisplayName = 'TestDisplayName';
		store.roadmapStore.roadmaps = [];
		store.commonStore.setAppLoaded();
		store.authStore.user = {
			displayName: userDisplayName,
			token: '',
			username: 'test'
		};
		const { getByText } = render(
			<StoreProvider store={store}>
				<Router history={browserHistory}>
					<Dashboard />
				</Router>
			</StoreProvider>
		);

		expect(getByText(userDisplayName)).toBeInTheDocument();
	});
});
