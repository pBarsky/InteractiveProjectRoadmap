import { render } from '@testing-library/react';
import format from 'date-fns/format';
import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import constants from '../../../app/constants/constants';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Roadmap } from '../../../app/models/roadmap';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import RoadmapCard from '../RoadmapCard';

describe('<RoadmapCard/>', () => {
	const defaultTestRoadmap: Roadmap = {
		description: 'sample description',
		endsOn: new Date('2020-03-15T23:00'),
		startsOn: new Date('2020-03-16T23:00'),
		id: 1,
		name: 'sample name'
	};

	it('Should render all properties of roadmap', () => {
		const testRoadmap: Roadmap = { ...defaultTestRoadmap };
		store.roadmapStore.selectedRoadmap = testRoadmap;
		const { getByDisplayValue } = render(
			<WithStoresAndRouter store={store}>
				<ReactFlowProvider>
					<RoadmapCard />
				</ReactFlowProvider>
			</WithStoresAndRouter>
		);

		expect(getByDisplayValue(testRoadmap.description!)).toBeInTheDocument();
		expect(getByDisplayValue(testRoadmap.name)).toBeInTheDocument();
		expect(
			getByDisplayValue(format(testRoadmap.endsOn!, constants.dateFormat))
		).toBeInTheDocument();
		expect(
			getByDisplayValue(format(testRoadmap.startsOn, constants.dateFormat))
		).toBeInTheDocument();
	});

	it('Should mark card when todays date is past endsOn date', () => {
		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<ReactFlowProvider>
					<RoadmapCard testDate={new Date('2033-03-16T23:00')} />
				</ReactFlowProvider>
			</WithStoresAndRouter>
		);

		expect(getByText(defaultDict.pages.roadmap.roadmapLate)).toBeInTheDocument();
	});

	it('Should render image when imageUrl is present in data', () => {
		const testRoadmap: Roadmap = {
			...defaultTestRoadmap,
			imageUrl: 'https://via.placeholder.com/100'
		};

		store.roadmapStore.selectedRoadmap = testRoadmap;

		const { getByAltText } = render(
			<WithStoresAndRouter store={store}>
				<ReactFlowProvider>
					<RoadmapCard />
				</ReactFlowProvider>
			</WithStoresAndRouter>
		);

		const roadmapDict = defaultDict.pages.roadmap;

		expect(getByAltText(roadmapDict.roadmapImageAltText)).toBeInTheDocument();
	});
});
