import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactFlow, { Controls, FlowElement, Node, useStoreState } from 'react-flow-renderer';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone } from '../../app/models/milestone';
import { useStore } from '../../app/stores/store';
import Loader from '../common/Loader';
import MilestoneListItem from './MilestoneListItem';
import styles from './MilestonesList.module.scss';

const MilestonesList = () => {
	const { milestoneStore, roadmapStore } = useStore();
	const { milestones } = milestoneStore;
	const transformation = useStoreState((state) => state.transform);

	if (milestoneStore.loading) {
		return <Loader />;
	}

	const customMilestoneNode = (data: FlowElement<Milestone>) => (
		<MilestoneListItem milestone={data.data!} />
	);

	const elements: FlowElement[] = milestones.map((milestone) => ({
		id: `${milestone.id}`,
		data: milestone,
		type: 'milestone',
		position: { x: milestone.posX, y: milestone.posY }
	}));

	const style = {
		'--data-x': `${transformation[0]}px`,
		'--data-y': `${transformation[1]}px`,
		'--data-scale': transformation[2],
		'--x-size': `${roadmapStore.backgroundImageSize[0]}px`,
		'--y-size': `${roadmapStore.backgroundImageSize[1]}px`,
		'--background-url': `url(${roadmapStore.selectedRoadmap?.imageUrl || ''})`
	} as React.CSSProperties;

	const moveMilestone = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
		milestoneStore.updatePosition(parseInt(node.id), node.position.x, node.position.y);
	};

	const nodeTypes = {
		milestone: customMilestoneNode
	};

	return (
		<>
			{milestoneStore.milestones.length === 0 && (
				<h2>{defaultDict.pages.milestone.noMilestones}</h2>
			)}
			<ReactFlow
				elements={elements}
				style={style}
				onNodeDragStop={moveMilestone}
				nodeTypes={nodeTypes}
				className={styles.map}
			>
				<Controls />
			</ReactFlow>
		</>
	);
};

export default observer(MilestonesList);
