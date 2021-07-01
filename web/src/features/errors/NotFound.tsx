import React from 'react';
import { Link } from 'react-router-dom';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import Button from '../common/buttons/Button';
import routes from '../common/routing/routes';
import styles from './NotFound.module.scss';
interface NotFoundProps {
	message?: string;
}
const NotFound = ({ message }: NotFoundProps): JSX.Element => {
	const {
		authStore: { isLoggedIn }
	} = useStore();
	const route = isLoggedIn ? routes.user.dashboard : routes.common.home;
	const text = isLoggedIn
		? defaultDict.forms.buttons.returnToDashboard.text
		: defaultDict.forms.buttons.returnToHomepage.text;

	return (
		<div className={styles.container}>
			<h1>{message ?? defaultDict.pages.notFound.message}</h1>
			<Link
				to={route}
				component={() => <Button className={styles.backButton}>{text}</Button>}
			/>
		</div>
	);
};

export default NotFound;
