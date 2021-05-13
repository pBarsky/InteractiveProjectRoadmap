import { shallow } from 'enzyme'
import React from 'react'
import { Router } from 'react-router-dom'
import { StoreProvider } from '../../../stores/store'
import { browserHistory } from '../../App'
import Navbar from '../Navbar'

it('Should render a nav', () => {
  const navbar = shallow(
    <StoreProvider>
      <Router history={browserHistory}>
        <Navbar />
      </Router>
    </StoreProvider>
  )

  const nav = navbar.find('nav')

  expect(nav).toBeDefined()
})
