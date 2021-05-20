import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
/*
 * strona główna, napis z przywitaniem i link do logowania/rejestracji
 */

const Homepage = () => {
  const { authStore: userStore } = useStore();

  return (
    <Segment textAlign='center' vertical>
      <Container text>
        <Segment basic style={{ fontSize: '2em' }}>
          <Header size='medium' as='h2' style={{ marginBottom: -15, textDecoration: 'underline' }}>
            {defaultDict.common.welcomeMessage}
          </Header>
          <Header size='huge' as='h1' style={{ marginTop: 0 }}>
            {defaultDict.common.appName}
          </Header>
        </Segment>
        {userStore.isLoggedIn
          ? (
          <Button
            as={Link}
            to={routes.user.dashboard}
            size='huge'
            color='black'>
            {defaultDict.common.welcomeButton}
          </Button>
            )
          : (
          <Button as={Link} to={routes.auth.login} size='huge' color='black'>
            {defaultDict.forms.buttons.login.text}
          </Button>
            )}
      </Container>
    </Segment>
  );
};

export default observer(Homepage);
