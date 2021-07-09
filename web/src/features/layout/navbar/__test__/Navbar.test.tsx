import { render } from '@testing-library/react';
import React from 'react';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import { WithStoresAndRouter } from '../../../../setupTests';
import routes from '../../../common/routing/routes';
import Navbar from '../Navbar';
describe('<Navbar />', () => {
	it('Should render a nav', async () => {
		const { getByText } = render(
			<WithStoresAndRouter>
				<Navbar />
			</WithStoresAndRouter>
		);
		const rootLink = getByText(defaultDict.common.appName);
		expect(rootLink.closest('a')).toHaveAttribute('href', routes.common.home);
	});
});
