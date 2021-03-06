import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { browserHistory } from '../../App';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import routes from '../common/routing/routes';
import styles from './RoadmapList.module.scss';
import RoadmapListItem from './RoadmapListItem';

const RoadmapList = (): JSX.Element => {
	const { roadmapStore } = useStore();
	if (roadmapStore.roadmaps.length === 0) {
		return (
			<h1 className={styles.noRoadmapsHeader}>
				{defaultDict.pages.roadmap.noRoadmaps}
				<br />
				<Link to={routes.roadmap.add}>{defaultDict.pages.roadmap.proposalOfCreation}</Link>
			</h1>
		);
	}

	return (
		<div className={styles.roadmapList}>
			{roadmapStore.roadmaps.map((roadmap) => (
				<RoadmapListItem
					key={roadmap.id}
					onClick={(): void => {
						browserHistory.push(`${routes.roadmap.list}/${roadmap.id}`);
					}}
					roadmap={roadmap}
				/>
			))}
		</div>
	);
};

export default observer(RoadmapList);
