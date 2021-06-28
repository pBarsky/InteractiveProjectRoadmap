import { render } from '@testing-library/react';
import format from 'date-fns/format';
import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../App';
import constants from '../../../app/constants/constants';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Roadmap } from '../../../app/models/roadmap';
import { store, StoreProvider } from '../../../app/stores/store';
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
			<StoreProvider store={store}>
				<ReactFlowProvider>
					<Router history={browserHistory}>
						<RoadmapCard />
					</Router>
				</ReactFlowProvider>
			</StoreProvider>
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
			<StoreProvider store={store}>
				<ReactFlowProvider>
					<RoadmapCard testDate={new Date('2033-03-16T23:00')} />
				</ReactFlowProvider>
			</StoreProvider>
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
			<StoreProvider store={store}>
				<ReactFlowProvider>
					<RoadmapCard />
				</ReactFlowProvider>
			</StoreProvider>
		);

		const roadmapDict = defaultDict.pages.roadmap;

		expect(getByAltText(roadmapDict.roadmapImageAltText)).toBeInTheDocument();
	});
});
