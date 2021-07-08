import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import Milestones from './Milestones';
import styles from './MilestonesFlowMap.module.scss';

const MilestonesFlowMap = (): JSX.Element => {
	return (
		<ReactFlowProvider>
			<div className={styles.wrapper}>
				<Milestones />
			</div>
		</ReactFlowProvider>
	);
};

export default MilestonesFlowMap;
