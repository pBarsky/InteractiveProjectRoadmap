import { render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import App, { browserHistory } from '../App';
import routes from '../app/common/routing/routes';
import defaultDict from '../app/dictionaries/defaultDict';
import { StoreProvider } from '../app/stores/store';

describe('<App />', () => {
	it('Should render homepage when location is "/"', () => {
		const { getByText } = render(
			<StoreProvider>
				<Router history={browserHistory}>
					<App />
				</Router>
			</StoreProvider>
		);

		browserHistory.push(routes.common.home);

		expect(getByText(defaultDict.common.welcomeMessage)).toBeInTheDocument();
	});

	it('Should render not found when passed trash url', () => {
		const { getByText } = render(
			<StoreProvider>
				<Router history={browserHistory}>
					<App />
				</Router>
			</StoreProvider>
		);
		browserHistory.push('/testestestestewstest');

		expect(getByText(defaultDict.pages.notFound.message)).toBeInTheDocument();
	});
});
