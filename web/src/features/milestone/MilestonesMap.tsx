import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import MilestonesList from './MilestonesList';
import styles from './MilestonesMap.module.scss';

const MilestonesMap = () => {
	return (
		<ReactFlowProvider>
			<div className={styles.wrapper}>
				<MilestonesList />
			</div>
		</ReactFlowProvider>
	);
};

export default MilestonesMap;
