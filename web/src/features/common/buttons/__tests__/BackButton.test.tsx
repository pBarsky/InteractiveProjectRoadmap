import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { browserHistory } from '../../../../App';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import BackButton from '../BackButton';

describe('<BackButton />', () => {
	it('Should display a button with custom content when provided', () => {
		const content = 'test content';
		const { getByText } = render(<BackButton content={content} />);

		expect(getByText(content)).toBeInTheDocument();
	});

	it('Should go back a page when clicked', async () => {
		const lastPage = '/lastPage';
		browserHistory.push(lastPage);
		browserHistory.push('/');
		const { getByText } = render(
			<Router history={browserHistory}>
				<BackButton />
			</Router>
		);

		await userEvent.click(getByText(defaultDict.common.backButton));

		await waitFor(() => {
			expect(browserHistory.location.pathname).toBe(lastPage);
		});
	});
});
