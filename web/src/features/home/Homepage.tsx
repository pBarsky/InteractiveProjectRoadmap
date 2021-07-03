import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import Button from '../common/buttons/Button';
import routes from '../common/routing/routes';
import styles from './Homepage.module.scss';

const Homepage = (): JSX.Element => {
	const {
		authStore: { isLoggedIn }
	} = useStore();

	if (isLoggedIn) {
		return <Redirect to={routes.user.dashboard} />;
	}

	return (
		<div className={styles.homepage}>
			<div className={styles.headers}>
				<h2 className={styles.welcomeHeader}>{defaultDict.common.welcomeMessage}</h2>
				<h1 className={styles.appNameHeader} style={{ marginTop: 0 }}>
					{defaultDict.common.appName}
				</h1>
			</div>
			<Link to={routes.auth.login}>
				<Button className={styles.loginButton} size='huge'>
					{defaultDict.forms.buttons.login.text}
				</Button>
			</Link>
		</div>
	);
};

export default observer(Homepage);
