import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import Button from '../common/buttons/Button';
import Loader from '../common/Loader';
import routes from '../common/routing/routes';
import RoadmapList from '../roadmaps/RoadmapList';
import styles from './Dashboard.module.scss';

const Dashboard = (): JSX.Element => {
	const { authStore, roadmapStore } = useStore();
	const { user } = authStore;

	useEffect(() => {
		roadmapStore.loadRoadmaps();
	}, [roadmapStore]);

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.greeting}>{defaultDict.pages.dashboard.greeting}</h2>
			<h1 className={styles.name}>{user?.displayName}</h1>
			<Link to={routes.roadmap.add}>
				<Button>{defaultDict.forms.buttons.addNewRoadmap.text}</Button>
			</Link>
			<hr />
			{roadmapStore.loading
				? (
					<Loader content={defaultDict.pages.dashboard.loading} />
				)
				: (
					<RoadmapList />
				)}
		</div>
	);
};

export default observer(Dashboard);
