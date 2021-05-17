import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../../app/common/routing/ProtectedRoute';
import routes from '../../app/common/routing/routes';
import Login from '../auth/Login';
import Register from '../auth/Register';
import NotFound from '../errors/NotFound';
import Homepage from '../home/Homepage';
import Dashboard from '../users/Dashboard';

const Routes = () => {
  return (
    <Switch>
      <Route path={routes.auth.login} component={Login} />
      <Route path={routes.auth.register} component={Register} />
      <ProtectedRoute path={routes.user.dashboard} component={Dashboard} />
      <Route exact path={routes.common.home} component={Homepage} />
      <Route path={routes.common.notFound} component={NotFound} />
      <Redirect to={routes.common.notFound} />
    </Switch>
  );
};

export default Routes;
