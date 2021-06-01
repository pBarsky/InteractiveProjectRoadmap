import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { browserHistory } from '../../../App';
import routes from '../../../app/common/routing/routes';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { store, StoreProvider } from '../../../app/stores/store';
import RoadmapDetails from '../RoadmapDetails';

describe('<RoadmapDetails />', () => {
  it('Should display loader when fetching data', () => {
    const route = `${routes.roadmap.list}/1`;
    browserHistory.push(route);
    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <RoadmapDetails />
        </Router>
      </StoreProvider>
    );

    expect(getByText(defaultDict.pages.roadmap.loadingDetails)).toBeInTheDocument();
  });

  it('Should display roadmap when data is loaded', async () => {
    const route = `${routes.roadmap.list}/1`;
    browserHistory.push(route);
    const testRoadmap = {
      description: 'Lorem ipsum piwo piwo piwo',
      name: 'DASDASD',
      id: 1,
      endsOn: null,
      startsOn: new Date('1999-02-15T22:22')
    };
    store.roadmapStore.roadmaps = [testRoadmap];
    store.roadmapStore.selectedRoadmap = testRoadmap;
    const { getByDisplayValue } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <RoadmapDetails />
        </Router>
      </StoreProvider>
    );
    await waitFor(() => {
      expect(getByDisplayValue(testRoadmap.description)).toBeInTheDocument();
      expect(getByDisplayValue(testRoadmap.name)).toBeInTheDocument();
    });
  });
});
