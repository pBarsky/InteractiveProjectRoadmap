import { render } from '@testing-library/react';
import React from 'react';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import routes from '../../common/routing/routes';
import RoadmapList from '../RoadmapList';

describe('<RoadmapList />', () => {
	it('Should display message and a proposal with a link to add form when no roadmaps where found', () => {
		store.roadmapStore.roadmaps = [];
		const { getByText } = render(
			<WithStoresAndRouter>
				<RoadmapList />
			</WithStoresAndRouter>
		);

		expect(getByText(defaultDict.pages.roadmap.noRoadmaps)).toBeInTheDocument();
		expect(
			getByText(defaultDict.pages.roadmap.proposalOfCreation).closest('a')
		).toHaveAttribute('href', routes.roadmap.add);
	});
});
