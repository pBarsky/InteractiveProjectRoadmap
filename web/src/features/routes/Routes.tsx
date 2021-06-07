import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProtectedRoute from '../common/routing/ProtectedRoute';
import routes from '../common/routing/routes';
import NotFound from '../errors/NotFound';
import Homepage from '../home/Homepage';
import AddRoadmap from '../roadmaps/AddRoadmap';
import RoadmapDetails from '../roadmaps/RoadmapDetails';
import Dashboard from '../users/Dashboard';

const Routes = () => {
	return (
		<Switch>
			<Route path={routes.auth.login} component={Login} />
			<Route path={routes.auth.register} component={Register} />
			<ProtectedRoute path={routes.roadmap.add} component={AddRoadmap} />
			<ProtectedRoute path={routes.user.dashboard} component={Dashboard} />
			<ProtectedRoute path={routes.roadmap.details} component={RoadmapDetails} />
			<Route exact path={routes.common.home} component={Homepage} />
			<Route path={routes.common.notFound} component={NotFound} />
			<Redirect to={routes.common.notFound} />
		</Switch>
	);
};

export default Routes;
