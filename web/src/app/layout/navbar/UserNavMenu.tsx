import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'semantic-ui-react'
import routes from '../../common/routing/routes'
import { useStore } from '../../stores/store'

const UserNavMenu = () => {
  const {
    userStore: { user, logout, isLoggedIn }
  } = useStore()

  const element = isLoggedIn
    ? (
    <Dropdown
      pointing='top left'
      text={user?.displayName}
      data-testid='dropdown'>
      <Dropdown.Menu data-testid='menu'>
        <Dropdown.Item
          as={Link}
          text='Dashboard'
          to='/dashboard'
          icon='dashboard'
        />
        <Dropdown.Item text='Logout' icon='log out' onClick={logout} />
      </Dropdown.Menu>
    </Dropdown>
      )
    : (
    <Button
      as={NavLink}
      to={routes.auth.login}
      basic
      inverted
      content='login'
    />
      )

  return (
    <Menu.Item position='right' data-testid='menu'>
      {element}
    </Menu.Item>
  )
}

export default observer(UserNavMenu)
