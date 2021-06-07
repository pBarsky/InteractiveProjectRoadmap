import { render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import { StoreProvider } from '../../../../app/stores/store';
import routes from '../../../common/routing/routes';
import Navbar from '../Navbar';
describe('<Navbar />', () => {
	it('Should render a nav', async () => {
		const { getByText } = render(
			<StoreProvider>
				<Router history={browserHistory}>
					<Navbar />
				</Router>
			</StoreProvider>
		);
		const rootLink = getByText(defaultDict.common.appName);
		expect(rootLink.closest('a')).toHaveAttribute('href', routes.common.home);
	});
});
