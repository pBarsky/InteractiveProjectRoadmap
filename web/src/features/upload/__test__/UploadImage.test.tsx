import { render, waitFor } from '@testing-library/react';
import React from 'react';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import UploadImage from '../UploadImage';

describe('<UploadImage />', () => {
	it('Should render form with button', async () => {
		const { getByRole } = render(
			<WithStoresAndRouter store={store}>
				<UploadImage hideForm={(): boolean => false} />
			</WithStoresAndRouter>
		);

		await waitFor(() => {
			expect(
				getByRole('button', { name: defaultDict.forms.buttons.save.text })
			).toBeInTheDocument();
		});
	});
});
