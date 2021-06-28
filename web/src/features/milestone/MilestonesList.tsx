import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactFlow, { Controls, FlowElement, Node, useStoreState } from 'react-flow-renderer';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone } from '../../app/models/milestone';
import { useStore } from '../../app/stores/store';
import Loader from '../common/Loader';
import MilestoneListItem from './MilestoneListItem';

const MilestonesList = () => {
	const { milestoneStore } = useStore();
	const { milestones } = milestoneStore;
	const transformation = useStoreState((state) => state.transform);
	if (milestoneStore.milestones.length === 0) {
		return <h2>{defaultDict.pages.milestone.noMilestones}</h2>;
	}
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
		'--data-scale': transformation[2]
	} as React.CSSProperties;

	const moveMilestone = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
		milestoneStore.updatePosition(parseInt(node.id), node.position.x, node.position.y);
	};

	const nodeTypes = {
		milestone: customMilestoneNode
	};

	return (
		<div style={{ width: '300px', height: '300px' }}>
			<ReactFlow
				elements={elements}
				style={style}
				onNodeDragStop={moveMilestone}
				nodeTypes={nodeTypes}
			>
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default observer(MilestonesList);
