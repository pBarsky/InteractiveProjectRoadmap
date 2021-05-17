import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import routes from '../../common/routing/routes';
import defaultDict from '../../dictionaries/defaultDict';
import { useStore } from '../../stores/store';

const UserNavMenu = () => {
  const {
    authStore: { user, logout, isLoggedIn }
  } = useStore();

  const dropDown = (
    <Dropdown
      pointing='top left'
      text={user?.displayName}
      data-testid='dropdown'>
      <Dropdown.Menu data-testid='menu'>
        <Dropdown.Item
          as={Link}
          text={defaultDict.forms.buttons.dashboard.text}
          to={routes.user.dashboard}
          icon='dashboard'
        />
        <Dropdown.Item
          text={defaultDict.forms.buttons.logout.text}
          icon='log out'
          onClick={logout}
        />
      </Dropdown.Menu>
    </Dropdown>
  );

  const loginButton = (
    <Button
      as={NavLink}
      to={routes.auth.login}
      basic
      inverted
      content={defaultDict.forms.buttons.login.text}
    />
  );

  return (
    <Menu.Item position='right' data-testid='menu'>
      {isLoggedIn ? dropDown : loginButton}
    </Menu.Item>
  );
};

export default observer(UserNavMenu);
