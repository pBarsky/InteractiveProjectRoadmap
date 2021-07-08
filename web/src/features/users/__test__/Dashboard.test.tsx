import { render } from '@testing-library/react';
import React from 'react';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
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
			<WithStoresAndRouter store={store}>
				<Dashboard />
			</WithStoresAndRouter>
		);

		expect(getByText(userDisplayName)).toBeInTheDocument();
	});
});
