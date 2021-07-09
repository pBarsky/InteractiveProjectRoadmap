import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import constants from '../../../app/constants/constants';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Milestone } from '../../../app/models/milestone';
import { WithStoresAndRouter } from '../../../setupTests';
import MilestoneCard from '../MilestoneCard';

describe('<MilestoneCard/>', () => {
	const defaultTestMilestone: Milestone = {
		description: 'sample description',
		connectedToId: null,
		posX: 0,
		posY: 0,
		endsOn: new Date('2020-03-15'),
		status: 0,
		parentProjectId: 1,
		id: 1,
		name: 'sample name'
	};

	it('Should render all properties of milestone', () => {
		const testMilestone: Milestone = { ...defaultTestMilestone };
		const { getByText, getByDisplayValue } = render(
			<WithStoresAndRouter>
				<MilestoneCard milestone={testMilestone} />
			</WithStoresAndRouter>
		);

		waitFor(() => {
			expect(getByText(testMilestone.name)).toBeInTheDocument();
			expect(
				getByDisplayValue(defaultDict.common.status[testMilestone.status])
			).toBeInTheDocument();
			expect(
				getByText(new RegExp(testMilestone.endsOn!.toLocaleDateString(), 'i'))
			).toBeInTheDocument();
		});
	});
	it('Should show description after click on', () => {
		const repeatWord = '😎🤙';

		const { getByTestId, getByText } = render(
			<WithStoresAndRouter>
				<MilestoneCard
					milestone={{ ...defaultTestMilestone, description: repeatWord.repeat(50) }}
				/>
			</WithStoresAndRouter>
		);
		act(() => userEvent.click(getByTestId(constants.testIds.editButton)));

		waitFor(() => expect(getByText(new RegExp(`${repeatWord}`))).toBeInTheDocument());
	});
});
