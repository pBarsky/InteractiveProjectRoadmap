import { render } from '@testing-library/react';
import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Milestone } from '../../../app/models/milestone';
import { Roadmap } from '../../../app/models/roadmap';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import Milestones from '../Milestones';

describe('<MilestoneCard />', () => {
	it('Should display message when no milestones where found', () => {
		store.milestoneStore.milestones = [];
		const { getByText } = render(
			<WithStoresAndRouter>
				<ReactFlowProvider>
					<div style={{ width: '1000px', height: '1000px' }}>
						<Milestones />
					</div>
				</ReactFlowProvider>
			</WithStoresAndRouter>
		);

		expect(getByText(defaultDict.pages.milestone.noMilestones)).toBeInTheDocument();
	});

	it('Should display map with milestones', () => {
		const firstDescription = 'test description';
		const secondDescription = 'test description2';

		const defaultRoadmap: Roadmap = {
			id: 1,
			description: firstDescription,
			name: 'test name',
			startsOn: new Date('2020-05-22T23:33'),
			endsOn: null
		};

		const defaultMilestone: Milestone = {
			parentProjectId: defaultRoadmap.id,
			status: 0,
			id: 1,
			posX: 0,
			connectedToId: null,
			posY: 0,
			description: firstDescription,
			name: 'test name',
			endsOn: new Date('2020-05-22')
		};
		store.milestoneStore.milestones = [
			{ ...defaultMilestone },
			{ ...defaultMilestone, id: 2, description: secondDescription }
		];

		const { getByText } = render(
			<WithStoresAndRouter>
				<ReactFlowProvider>
					<div style={{ width: '1000px', height: '1000px' }}>
						<Milestones />
					</div>
				</ReactFlowProvider>
			</WithStoresAndRouter>
		);

		expect(getByText(firstDescription)).toBeInTheDocument();
		expect(getByText(secondDescription)).toBeInTheDocument();
	});
});
