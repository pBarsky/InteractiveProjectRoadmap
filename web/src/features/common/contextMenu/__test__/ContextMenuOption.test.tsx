import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContextMenuOption from '../ContextMenuOption';

describe('<ContextMenuOption />', () => {
	it('Should display an option with given label', () => {
		const label = 'Label';
		const onClick = jest.fn();

		const { getByText } = render(<ContextMenuOption label={label} onClick={onClick} />);

		expect(getByText(label)).toBeInTheDocument();
	});

	it('Should call onClick when clicked', () => {
		const label = 'Label';
		const onClick = jest.fn();

		const { getByText } = render(<ContextMenuOption label={label} onClick={onClick} />);

		userEvent.click(getByText(label));

		expect(onClick).toHaveBeenCalled();
	});
});
