import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { browserHistory } from '../../App';
import BackButton from '../../app/common/buttons/BackButton';
import Button from '../../app/common/buttons/Button';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import AddMilestone from '../milestone/AddMilestone';
import RoadmapCard from './RoadmapCard';
import styles from './RoadmapDetails.module.scss';

const RoadmapDetails = () => {
	const { roadmapStore, milestoneStore } = useStore();
	const scrollRef = useRef<HTMLDivElement>(null);
	const params = useParams<{ id: string }>();
	const id = parseInt(params.id);
	const [isAddMilestoneVisible, setIsAddMilestoneVisible] = useState(false);
	const [isButtonVisible, setIsButtonVisible] = useState(true);
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

	const toggleAddMilestoneForm = () => {
		setIsAddMilestoneVisible((oldState) => !oldState);
		setIsButtonVisible((oldState) => !oldState);
	};
	return (
		<div className={styles.container}>
			<RoadmapCard roadmap={roadmapStore.selectedRoadmap} />
			{isButtonVisible && (
				<Button className={styles.addMilestoneButton} onClick={toggleAddMilestoneForm}>
					{defaultDict.forms.buttons.addNewMilestone.text}
				</Button>
			)}
			<CSSTransition
				in={isAddMilestoneVisible}
				timeout={200}
				classNames={{
					enter: styles.addMilestoneFormEnter,
					enterActive: styles.addMilestoneFormEnterActive,
					exit: styles.addMilestoneFormExit,
					exitActive: styles.addMilestoneFormExitActive
				}}
				onEntered={() => scrollRef?.current?.scrollIntoView()}
				unmountOnExit
			>
				<div ref={scrollRef} className={styles.addMilestoneForm}>
					<AddMilestone roadmapId={id} afterSubmit={toggleAddMilestoneForm} />
				</div>
			</CSSTransition>
			<BackButton className={styles.backButton} backUrl={routes.user.dashboard} />
		</div>
	);
};

export default observer(RoadmapDetails);
