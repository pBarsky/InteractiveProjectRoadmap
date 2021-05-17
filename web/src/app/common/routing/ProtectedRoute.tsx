import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStore } from '../../stores/store';
import routes from './routes';

const ProtectedRoute = (props: RouteProps) => {
  const {
    authStore: { isLoggedIn }
  } = useStore();

  if (isLoggedIn) {
    return <Route {...props} />;
  }
  return <Redirect to={routes.auth.login} />;
};

export default ProtectedRoute;
