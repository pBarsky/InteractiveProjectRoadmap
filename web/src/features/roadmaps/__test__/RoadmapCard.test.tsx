import { render } from '@testing-library/react';
import React from 'react';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Roadmap } from '../../../app/models/roadmap';
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
    const { getByText } = render(<RoadmapCard roadmap={testRoadmap} />);

    expect(getByText(testRoadmap.description!)).toBeInTheDocument();
    expect(getByText(testRoadmap.name)).toBeInTheDocument();
    expect(
      getByText(new RegExp(testRoadmap.endsOn!.toLocaleString(), 'i'))
    ).toBeInTheDocument();
    expect(
      getByText(new RegExp(testRoadmap.startsOn.toLocaleString(), 'i'))
    ).toBeInTheDocument();
  });

  it('Should mark card when todays date is past endsOn date', () => {
    const { getByText } = render(
      <RoadmapCard
        roadmap={defaultTestRoadmap}
        testDate={new Date('2033-03-16T23:00')}
      />
    );

    expect(
      getByText(defaultDict.pages.roadmap.roadmapLate)
    ).toBeInTheDocument();
  });

  it('Should cut description when fluid prop is not passed', () => {
    const repeatWord = '🍻';

    const { getByText } = render(
      <RoadmapCard
        roadmap={{ ...defaultTestRoadmap, description: repeatWord.repeat(50) }}
      />
    );

    expect(getByText(new RegExp(`${repeatWord}...$`))).toBeInTheDocument();
  });
});
