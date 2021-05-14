import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Router } from 'react-router'
import routes from '../../../common/routing/routes'
import { store, StoreProvider } from '../../../stores/store'
import { browserHistory } from '../../App'
import Navbar from '../Navbar'

describe('<UserNavMenu />', () => {
  it('Should contain login button when user is not authenticated', () => {
    const { getByTestId, getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <Navbar />
        </Router>
      </StoreProvider>
    )

    const loginButton = getByText(/login/i)

    expect(getByTestId('menu')).toBeInTheDocument()
    expect(loginButton).toBeInTheDocument()
    expect(loginButton.closest('a')).toHaveAttribute('href', routes.auth.login)
  })

  it('Should render user dropdown when user is authenticated', () => {
    store.userStore.user = {
      displayName: 'TestDisplayName',
      token: '',
      username: 'test'
    }
    const { getByTestId, getByText } = render(
      <StoreProvider store={store}>
        <Router history={browserHistory}>
          <Navbar />
        </Router>
      </StoreProvider>
    )
    expect(getByTestId('dropdown')).toBeInTheDocument()
    expect(getByText('TestDisplayName')).toBeInTheDocument()
  })

  it('User menu should contain dashboard, logout', () => {
    store.userStore.user = {
      displayName: 'TestDisplayName',
      token: '',
      username: 'test'
    }
    const { getByTestId, getByText } = render(
      <StoreProvider store={store}>
        <Router history={browserHistory}>
          <Navbar />
        </Router>
      </StoreProvider>
    )

    userEvent.click(getByTestId('dropdown'))

    const dashboard = getByText(/dashboard/i)
    expect(dashboard).toBeInTheDocument()
    expect(dashboard.closest('a')).toHaveAttribute(
      'href',
      routes.user.dashboard
    )
    expect(getByText(/logout/i)).toBeInTheDocument()
  })
})
