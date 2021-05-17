import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import css from './App.module.scss';
import ProtectedRoute from './app/common/routing/ProtectedRoute';
import routes from './app/common/routing/routes';
import Loader from './app/layout/Loader';
import Navbar from './app/layout/navbar/Navbar';
import { StoreProvider, useStore } from './app/stores/store';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import NotFound from './features/errors/NotFound';
import Homepage from './features/home/Homepage';
import Dashboard from './features/users/Dashboard';

export const browserHistory = createBrowserHistory();

function App () {
  const { commonStore, authStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      authStore.fetchUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, authStore]);

  if (!commonStore.appLoaded) {
    return <Loader content='Loading app...' />;
  }
  return (
    <StoreProvider>
      <Router history={browserHistory}>
        <Navbar />
        <Container className={css.Container} as='main'>
          <Switch>
            <Route path={routes.auth.login} component={Login} />
            <Route path={routes.auth.register} component={Register} />
            <ProtectedRoute
              path={routes.user.dashboard}
              component={Dashboard}
            />
            <Route exact path={routes.common.home} component={Homepage} />
            <Route path={routes.common.notFound} component={NotFound} />
            <Redirect to={routes.common.notFound} />
          </Switch>
        </Container>
      </Router>
    </StoreProvider>
  );
}

export default observer(App);
