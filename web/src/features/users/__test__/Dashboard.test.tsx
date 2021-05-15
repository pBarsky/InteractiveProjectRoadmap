import { render } from '@testing-library/react'
import { store, StoreProvider } from '../../../app/stores/store'
import Dashboard from '../Dashboard'

describe('<Dashboard />', () => {
  it('Should display user displayName', () => {
    const userDisplayName = 'TestDisplayName'
    store.userStore.user = {
      displayName: userDisplayName,
      token: '',
      username: 'test'
    }
    const { getByText } = render(
      <StoreProvider store={store}>
        <Dashboard />
      </StoreProvider>
    )

    expect(getByText(userDisplayName)).toBeInTheDocument()
  })
})
