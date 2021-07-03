import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import routes from './routes';

const ProtectedRoute = (props: RouteProps): JSX.Element => {
	const {
		authStore: { isLoggedIn }
	} = useStore();

	if (isLoggedIn) {
		return <Route {...props} />;
	}
	return <Redirect to={routes.auth.login} />;
};

export default ProtectedRoute;
