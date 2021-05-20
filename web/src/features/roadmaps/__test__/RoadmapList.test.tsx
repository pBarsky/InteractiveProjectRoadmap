import { render } from '@testing-library/react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import routes from '../../../app/common/routing/routes';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Roadmap } from '../../../app/models/roadmap';
import { store, StoreProvider } from '../../../app/stores/store';
import RoadmapList from '../RoadmapList';

describe('<RoadmapList />', () => {
  it('Should display message and a proposal with a link to add form when no roadmaps where found', () => {
    store.roadmapStore.roadmaps = [];
    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <RoadmapList />
        </Router>
      </StoreProvider>
    );

    expect(getByText(defaultDict.pages.roadmap.noRoadmaps)).toBeInTheDocument();
    expect(
      getByText(defaultDict.pages.roadmap.proposalOfCreation).closest('a')
    ).toHaveAttribute('href', routes.roadmap.add);
  });

  it('Should display cards with roadmaps, that have links to details on the onClick', () => {
    const firstDescription = 'test description';
    const secondDescription = 'test description2';
    const defaultRoadmap: Roadmap = {
      id: 1,
      description: firstDescription,
      name: 'test name',
      startsOn: new Date('2020-05-22T23:33'),
      endsOn: null
    };
    store.roadmapStore.roadmaps = [
      { ...defaultRoadmap },
      { ...defaultRoadmap, id: 2, description: secondDescription }
    ];

    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <RoadmapList />
        </Router>
      </StoreProvider>
    );

    expect(getByText(firstDescription)).toBeInTheDocument();
    expect(getByText(secondDescription)).toBeInTheDocument();
  });
});
