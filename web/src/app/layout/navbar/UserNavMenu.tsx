import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'
import { useStore } from '../../stores/store'

const UserNavMenu = () => {
  const {
    userStore: { user, logout, isLoggedIn }
  } = useStore()

  if (!isLoggedIn) {
    return <></>
  }

  return (
    <Dropdown pointing='top left' text={user?.displayName}>
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          text='Dashboard'
          to='/dashboard'
          icon='dashboard'
        />
        <Dropdown.Item
          as={Link}
          text='My profile'
          to={`/profile/${user?.username}`}
          icon='user'
        />
        <Dropdown.Item text='Logout' icon='log out' onClick={logout} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default observer(UserNavMenu)
