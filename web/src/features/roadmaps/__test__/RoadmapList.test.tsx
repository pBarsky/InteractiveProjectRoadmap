import { render } from '@testing-library/react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import routes from '../../../app/common/routing/routes';
import defaultDict from '../../../app/dictionaries/defaultDict';
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
});
