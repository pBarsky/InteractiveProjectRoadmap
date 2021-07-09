import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import constants from '../../../../app/constants/constants';
import EditDeleteButtons from '../EditDeleteButtons';

describe('<EditDeleteButtons />', () => {
	it('Should display buttons', () => {
		const testHandle = jest.fn();
		const { getAllByRole } = render(
			<EditDeleteButtons toggleEdit={testHandle} onDelete={testHandle} />
		);
		expect(getAllByRole('button')).toHaveLength(2);
	});

	it('Should call functions after clicking buttons', async () => {
		const testToggleEdit = jest.fn();
		const testOnDelete = jest.fn();

		const { getByTestId } = render(
			<EditDeleteButtons toggleEdit={testToggleEdit} onDelete={testOnDelete} />
		);

		const editButton = getByTestId(constants.testIds.editButton);
		const deleteButton = getByTestId(constants.testIds.deleteButton);

		act(() => {
			userEvent.click(editButton);
			userEvent.click(deleteButton);
		});

		expect(testOnDelete).toHaveBeenCalled();
		expect(testToggleEdit).toHaveBeenCalled();
	});
});
