import { render } from '@testing-library/react'
import { Router } from 'react-router'
import routes from '../../../app/common/routing/routes'
import { browserHistory } from '../../../app/layout/App'
import { store, StoreProvider } from '../../../app/stores/store'
import Homepage from '../Homepage'

describe('<Homepage />', () => {
  it('Should render login button when user is not authenticated', () => {
    const { getByRole } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <Homepage />
        </Router>
      </StoreProvider>
    )

    expect(
      getByRole('button', { name: /login/i }).closest('a')
    ).toHaveAttribute('href', routes.auth.login)
  })
  it('Should render dashboard button when user is authenticated', () => {
    store.userStore.user = {
      displayName: 'TestDisplayName',
      token: '',
      username: 'test'
    }

    const { getByRole } = render(
      <StoreProvider store={store}>
        <Router history={browserHistory}>
          <Homepage />
        </Router>
      </StoreProvider>
    )

    expect(
      getByRole('button', { name: /dashboard/i }).closest('a')
    ).toHaveAttribute('href', routes.user.dashboard)
  })
})
