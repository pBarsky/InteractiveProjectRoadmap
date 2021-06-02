import { render } from '@testing-library/react';
import React from 'react';
import { Roadmap } from '../../../app/models/roadmap';
import RoadmapListItem from '../RoadmapListItem';

describe('<RoadmapListItem/>', () => {
	const defaultTestRoadmap: Roadmap = {
		description: 'sample description',
		endsOn: new Date('2020-03-15T23:00'),
		startsOn: new Date('2020-03-16T23:00'),
		id: 1,
		name: 'sample name'
	};

	it('Should render all properties of roadmap', () => {
		const testRoadmap: Roadmap = { ...defaultTestRoadmap };
		const { getByText } = render(<RoadmapListItem roadmap={testRoadmap} />);

		expect(getByText(testRoadmap.name)).toBeInTheDocument();
		expect(
			getByText(new RegExp(testRoadmap.endsOn!.toLocaleString(), 'i'))
		).toBeInTheDocument();
		expect(
			getByText(new RegExp(testRoadmap.startsOn.toLocaleString(), 'i'))
		).toBeInTheDocument();
	});
});
