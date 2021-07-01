import React from 'react';
import { NavLink } from 'react-router-dom';
import defaultDict from '../../../app/dictionaries/defaultDict';
import styles from './Navbar.module.scss';
import UserNavMenu from './UserNavMenu';

const Navbar = (): JSX.Element => {
	return (
		<nav className={styles.navBar}>
			<div className={styles.wrapper}>
				<NavLink activeClassName={styles.active} to='/' exact className={styles.rootLink}>
					{defaultDict.common.appName}
				</NavLink>
				<UserNavMenu />
			</div>
		</nav>
	);
};

export default Navbar;
