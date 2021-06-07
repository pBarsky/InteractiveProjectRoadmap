import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { StoreProvider, useStore } from './app/stores/store';
import Loader from './features/common/Loader';
import Layout from './features/layout/Layout';

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
				<Layout />
			</Router>
		</StoreProvider>
	);
}

export default observer(App);
