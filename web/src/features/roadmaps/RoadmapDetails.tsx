import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { browserHistory } from '../../App';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import BackButton from '../common/buttons/BackButton';
import Loader from '../common/Loader';
import routes from '../common/routing/routes';
import RoadmapCard from './RoadmapCard';
import styles from './RoadmapDetails.module.scss';

const RoadmapDetails = (): JSX.Element => {
	const { roadmapStore, milestoneStore } = useStore();
	const params = useParams<{ id: string }>();
	const id = parseInt(params.id);

	useEffect(() => {
		if (id) {
			roadmapStore
				.loadRoadmap(id)
				.then(() => milestoneStore.getAll(roadmapStore.selectedRoadmap!))
				.catch(() => browserHistory.push(routes.user.dashboard));
		}
	}, [roadmapStore, id]);

	if (!roadmapStore.selectedRoadmap) {
		return <Loader content={defaultDict.pages.roadmap.loadingDetails} />;
	}

	return (
		<div className={styles.container}>
			<RoadmapCard />
			<BackButton className={styles.backButton} backUrl={routes.user.dashboard} />
		</div>
	);
};

export default observer(RoadmapDetails);
