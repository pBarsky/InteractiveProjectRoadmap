import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import css from './App.module.scss';
import Loader from './app/layout/Loader';
import Navbar from './app/layout/navbar/Navbar';
import { StoreProvider, useStore } from './app/stores/store';
import Routes from './features/routes/Routes';

export const browserHistory = createBrowserHistory();

function App () {
  const { commonStore, authStore } = useStore();

  useEffect(() => {
    if (authStore.token) {
      authStore.fetchUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, authStore]);

  if (!commonStore.appLoaded) {
    return <Loader page content='Loading app...' />;
  }
  return (
    <StoreProvider>
      <Router history={browserHistory}>
        <Navbar />
        <Container className={css.Container} as='main'>
          <Routes />
        </Container>
      </Router>
    </StoreProvider>
  );
}

export default observer(App);
