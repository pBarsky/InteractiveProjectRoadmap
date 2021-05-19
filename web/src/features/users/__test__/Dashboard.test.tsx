import { render } from '@testing-library/react';
import { store, StoreProvider } from '../../../app/stores/store';
import Dashboard from '../Dashboard';

describe('<Dashboard />', () => {
  it('Should display user displayName', () => {
    const userDisplayName = 'TestDisplayName';
    store.roadmapStore.roadmaps = [];
    store.commonStore.setAppLoaded();
    store.authStore.user = {
      displayName: userDisplayName,
      token: '',
      username: 'test'
    };
    const { getByText } = render(
      <StoreProvider store={store}>
        <Dashboard />
      </StoreProvider>
    );

    expect(getByText(userDisplayName)).toBeInTheDocument();
  });
});
