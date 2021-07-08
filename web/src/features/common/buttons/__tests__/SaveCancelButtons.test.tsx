import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import constants from '../../../../app/constants/constants';
import SaveCancelButtons from '../SaveCancelButtons';

describe('<SaveCancelButton />', () => {
	it('Should display buttons', () => {
		const testHandle = jest.fn();
		const { getAllByRole } = render(
			<SaveCancelButtons handleCancel={testHandle} handleEdit={testHandle} isValid={true} />
		);
		expect(getAllByRole('button')).toHaveLength(2);
	});

	it('Should call functions after clicking buttons', async () => {
		const testHandleCancel = jest.fn();
		const testHandleEdit = jest.fn();

		const { getByTestId } = render(
			<SaveCancelButtons
				handleCancel={testHandleCancel}
				handleEdit={testHandleEdit}
				isValid={true}
			/>
		);

		const saveButton = getByTestId(constants.testIds.saveButton);
		const cancelButton = getByTestId(constants.testIds.cancelButton);

		act(() => {
			userEvent.click(saveButton);
			userEvent.click(cancelButton);
		});

		expect(testHandleEdit).toHaveBeenCalled();
		expect(testHandleCancel).toHaveBeenCalled();
	});
});
