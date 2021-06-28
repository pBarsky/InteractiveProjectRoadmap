import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { StoreProvider } from '../../../app/stores/store';
import UploadImage from '../UploadImage';

describe('<UploadImage />', () => {
	it('Should render form with button with image preview', async () => {
		const { getByRole } = render(
			<StoreProvider>
				<Router history={browserHistory}>
					<UploadImage hideForm={() => false} />
				</Router>
			</StoreProvider>
		);

		await waitFor(() => {
			expect(
				getByRole('button', { name: defaultDict.forms.buttons.save.text })
			).toBeInTheDocument();
			// expect(getByLabelText(defaultDict.forms.inputs.upload.label));
			expect(getByRole('img')).toBeInTheDocument();
		});
	});
});
