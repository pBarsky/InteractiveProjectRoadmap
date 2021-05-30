import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Milestone } from '../../../app/models/milestone';
import { Roadmap } from '../../../app/models/roadmap';
import { store, StoreProvider } from '../../../app/stores/store';
import MilestonesList from '../MilestonesList';

describe('<MilestoneListItem />', () => {
  it('Should display message when no milestones where found', () => {
    store.milestoneStore.milestones = [];
    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <MilestonesList />
        </Router>
      </StoreProvider>
    );

    expect(getByText(defaultDict.pages.milestone.noMilestones)).toBeInTheDocument();
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

    const defaultMilestone: Milestone = {
      parentProjectId: defaultRoadmap.id,
      status: 0,
      id: 1,
      description: firstDescription,
      name: 'test name',
      endsOn: new Date('2020-05-22')
    };
    store.milestoneStore.milestones = [
      { ...defaultMilestone },
      { ...defaultMilestone, id: 2, description: secondDescription }
    ];

    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <MilestonesList />
        </Router>
      </StoreProvider>
    );

    waitFor(() => {
      expect(getByText(firstDescription)).toBeInTheDocument();
      expect(getByText(secondDescription)).toBeInTheDocument();
    });
  });
});
