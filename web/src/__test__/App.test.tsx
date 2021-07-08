import { render } from '@testing-library/react';
import React from 'react';
import App, { browserHistory } from '../App';
import defaultDict from '../app/dictionaries/defaultDict';
import routes from '../features/common/routing/routes';
import { WithStoresAndRouter } from '../setupTests';

describe('<App />', () => {
	it('Should render homepage when location is "/"', () => {
		const { getByText } = render(
			<WithStoresAndRouter>
				<App />
			</WithStoresAndRouter>
		);

		browserHistory.push(routes.common.home);

		expect(getByText(defaultDict.common.welcomeMessage)).toBeInTheDocument();
	});

	it('Should render not found when passed trash url', () => {
		const { getByText } = render(
			<WithStoresAndRouter>
				<App />
			</WithStoresAndRouter>
		);
		browserHistory.push('/testestestestewstest');

		expect(getByText(defaultDict.pages.notFound.message)).toBeInTheDocument();
	});
});
