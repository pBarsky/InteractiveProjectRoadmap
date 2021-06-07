import { faTachometerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { useStore } from '../../../app/stores/store';
import Button from '../../common/buttons/Button';
import routes from '../../common/routing/routes';
import DropdownMenu from './DropdownMenu';
import DropdownMenuItem from './DropdownMenuItem';
import styles from './UserNavMenu.module.scss';

const UserNavMenu = () => {
	const {
		authStore: { user, logout, isLoggedIn }
	} = useStore();

	const {
		forms: {
			buttons: {
				dashboard: { text: dashboardText },
				logout: { text: logoutText }
			}
		}
	} = defaultDict;
	const logoutUser = () => {
		logout();
		browserHistory.push('/');
	};

	const dropDown = (
		<DropdownMenu text={user?.displayName}>
			<DropdownMenuItem icon={faTachometerAlt}>
				<Link to={routes.user.dashboard}>{dashboardText}</Link>
			</DropdownMenuItem>
			<DropdownMenuItem icon={faUser} onClick={logoutUser}>
				{logoutText}
			</DropdownMenuItem>
		</DropdownMenu>
	);

	const loginButton = (
		<NavLink to={routes.auth.login}>
			<Button className={styles.loginButton} outlined>
				{defaultDict.forms.buttons.login.text}
			</Button>
		</NavLink>
	);

	return isLoggedIn ? dropDown : loginButton;
};

export default observer(UserNavMenu);
