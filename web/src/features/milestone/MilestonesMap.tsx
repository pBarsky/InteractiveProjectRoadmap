import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import MilestonesList from './MilestonesList';

const MilestonesMap = () => {
	return (
		<ReactFlowProvider>
			<MilestonesList />
		</ReactFlowProvider>
	);
};

export default MilestonesMap;
