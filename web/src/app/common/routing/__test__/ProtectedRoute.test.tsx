import { render } from '@testing-library/react'
import React from 'react'
import { Router } from 'react-router'
import { browserHistory } from '../../../layout/App'
import { store, StoreProvider } from '../../../stores/store'
import ProtectedRoute from '../ProtectedRoute'
import routes from '../routes'

describe('<ProtectedRoute />', () => {
  it('Should redirect to login page when user is not authorized', () => {
    render(
      <Router history={browserHistory}>
        <ProtectedRoute
          path='/'
          render={() => <div data-testid='protectedDiv'></div>}
        />
      </Router>
    )

    expect(browserHistory.location.pathname).toBe(routes.auth.login)
  })
  it('Should render desired component when user is authorized', () => {
    store.userStore.user = { displayName: 'test', token: '', username: 'test' }

    const { getByTestId } = render(
      <StoreProvider store={store}>
        <Router history={browserHistory}>
          <ProtectedRoute
            path='/'
            render={() => <div data-testid='protectedDiv'>test</div>}
          />
        </Router>
      </StoreProvider>
    )

    expect(getByTestId('protectedDiv')).toBeInTheDocument()
  })
})
