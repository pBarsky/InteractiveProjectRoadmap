import React from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Menu } from 'semantic-ui-react'
import UserNavMenu from './UserNavMenu'

const Navbar = () => {
  return (
    <>
      <Menu inverted size='massive'>
        <Container as='nav'>
          <Menu.Item as={NavLink} to='/' exact header>
            Roadmap
          </Menu.Item>
          <Menu.Item position='right'>
            <UserNavMenu />
          </Menu.Item>
        </Container>
      </Menu>
    </>
  )
}

export default Navbar
