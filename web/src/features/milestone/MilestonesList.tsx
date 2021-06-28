import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactFlow, { Controls, FlowElement, useStoreState } from 'react-flow-renderer';
import defaultDict from '../../app/dictionaries/defaultDict';
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
	const elements: FlowElement[] = milestones.map((x, idx) => ({
		id: `${x.id}`,
		data: { label: <MilestoneListItem milestone={x} /> },
		position: { x: idx * 50, y: idx * 50 },
		style: {
			display: 'flex',
			flexDirection: 'row',
			border: '1px solid var(--gray)',
			borderRadius: '5px',
			padding: '2em',
			margin: 'auto auto 2em',
			boxShadow: 'var(--defaultBoxShadow)'
		}
	}));

	const style = {
		'--data-x': `${transformation[0]}px`,
		'--data-y': `${transformation[1]}px`,
		'--data-scale': transformation[2]
	} as React.CSSProperties;

	const moveMilestone = (event: React.MouseEvent<Element, MouseEvent>, node: FlowElement) => {
		milestoneStore.updatePosition(parseInt(node.id), event.pageX, event.pageY);
	};

	return (
		<div style={{ width: '1000px', height: '1000px' }}>
			<ReactFlow elements={elements} style={style} onNodeDragStop={moveMilestone}>
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default observer(MilestonesList);
