import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import defaultDict from '../../dictionaries/defaultDict';
import UserNavMenu from './UserNavMenu';

const Navbar = () => {
  return (
    <Menu inverted size='massive'>
      <Container as='nav'>
        <Menu.Item as={NavLink} to='/' exact header data-testid='rootLink'>
          {defaultDict.common.appName}
        </Menu.Item>
        <UserNavMenu />
      </Container>
    </Menu>
  );
};

export default Navbar;
