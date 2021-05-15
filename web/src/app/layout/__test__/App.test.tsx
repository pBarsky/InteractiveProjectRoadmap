import { render } from '@testing-library/react'
import React from 'react'
import { Router } from 'react-router-dom'
import routes from '../../common/routing/routes'
import { StoreProvider } from '../../stores/store'
import App, { browserHistory } from '../App'

describe('<App />', () => {
  it('Should render homepage when location is "/"', () => {
    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <App />
        </Router>
      </StoreProvider>
    )

    browserHistory.push(routes.common.home)

    expect(getByText(/welcome to roadmap/i)).toBeInTheDocument()
  })

  it('Should render not found when passed trash url', () => {
    const { getByText } = render(
      <StoreProvider>
        <Router history={browserHistory}>
          <App />
        </Router>
      </StoreProvider>
    )
    browserHistory.push('/testestestestewstest')

    expect(
      getByText(/Sorry. We could not find what you were looking for/i)
    ).toBeInTheDocument()
  })
})
