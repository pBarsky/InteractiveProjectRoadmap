import React from 'react';
import Routes from '../routes/Routes';
import styles from './Layout.module.scss';
import Navbar from './navbar/Navbar';

const Layout = () => {
	return (
		<>
			<Navbar />
			<main className={styles.container}>
				<Routes />
			</main>
		</>
	);
};

export default Layout;
