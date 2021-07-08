import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactFlow, {
	Connection,
	Controls,
	Edge,
	Node,
	OnConnectStartParams,
	Transform,
	useStoreState
} from 'react-flow-renderer';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone } from '../../app/models/milestone';
import { BackgroundSize } from '../../app/stores/roadmapStore';
import { useStore } from '../../app/stores/store';
import Loader from '../common/Loader';
import MilestoneFlowNode from './MilestoneFlowNode';
import styles from './Milestones.module.scss';

const generateStyles = (
	transformation: Transform,
	backgroundImageSize: BackgroundSize,
	imageUrl?: string
): React.CSSProperties => {
	return {
		'--data-x': `${transformation[0]}px`,
		'--data-y': `${transformation[1]}px`,
		'--data-scale': transformation[2],
		'--x-size': `${backgroundImageSize[0]}px`,
		'--y-size': `${backgroundImageSize[1]}px`,
		'--background-url': `url(${imageUrl || ''})`
	} as React.CSSProperties;
};

const Milestones = (): JSX.Element => {
	const { flowStore, milestoneStore, roadmapStore } = useStore();
	const { flowElements, addConnection: addEdge } = flowStore;
	const { isLoading, isEditing } = milestoneStore;
	const { backgroundImageSize, selectedRoadmap } = roadmapStore;
	const transformation = useStoreState((state) => state.transform);

	const areNodesDraggableAndConnectable = !isEditing;

	if (isLoading) {
		return <Loader />;
	}

	const onConnect = ({ source, target }: Edge<Milestone> | Connection): void => {
		if (!target || !source) {
			return;
		}
		const sourceId = parseInt(source);
		const targetId = parseInt(target);
		addEdge(sourceId, targetId);
	};

	const onEdgeUpdate = (
		_oldEdge: Edge<Milestone> | Connection,
		{ source, target }: Edge<Milestone> | Connection
	): void => {
		if (!target || !source) {
			return;
		}
		const sourceId = parseInt(source);
		const targetId = parseInt(target);

		flowStore.updateConnection(sourceId, targetId);
	};

	const removeEdge = ({ source }: Edge<Milestone> | Connection): void => {
		if (!source) {
			return;
		}
		const connectionId = parseInt(source);
		flowStore.removeConnection(connectionId);
	};

	const moveMilestone = (_: React.MouseEvent<Element, MouseEvent>, node: Node): void => {
		milestoneStore.updatePosition(parseInt(node.id), node.position.x, node.position.y);
	};

	const nodeTypes = {
		milestone: MilestoneFlowNode
	};

	const onEdgeUpdateEnd = ({ target }: MouseEvent, edge: Edge<Milestone>): void => {
		const { className } = target as HTMLElement;
		if (!`${className}`.match(/(react-flow__pane)/)) {
			return;
		}
		removeEdge(edge);
	};

	const onConnectStart = (
		_: React.MouseEvent<Element, MouseEvent>,
		{ nodeId }: OnConnectStartParams
	): void => {
		if (!nodeId) {
			return;
		}

		const id = parseInt(nodeId);
		flowStore.selectedElementId = id;
	};

	const onConnectStop = ({ target }: MouseEvent): void => {
		const { className } = target as HTMLElement;
		if (!className.match(/(react-flow__pane)/)) {
			return;
		}

		if (!flowStore.selectedElementId) {
			return;
		}

		flowStore.removeConnection(flowStore.selectedElementId);
	};

	return (
		<>
			{milestoneStore.milestones.length === 0 && (
				<h2>{defaultDict.pages.milestone.noMilestones}</h2>
			)}
			<ReactFlow
				elements={flowElements}
				style={generateStyles(
					transformation,
					backgroundImageSize,
					selectedRoadmap?.imageUrl
				)}
				minZoom={0}
				onNodeDragStop={moveMilestone}
				nodeTypes={nodeTypes}
				className={styles.map}
				onConnect={onConnect}
				nodesDraggable={areNodesDraggableAndConnectable}
				nodesConnectable={areNodesDraggableAndConnectable}
				onEdgeUpdate={onEdgeUpdate}
				panOnScroll
				onConnectStart={onConnectStart}
				onConnectStop={onConnectStop}
				onEdgeDoubleClick={(_, edge): void => removeEdge(edge)}
				zoomOnDoubleClick={false}
				onEdgeUpdateEnd={onEdgeUpdateEnd}
				edgeUpdaterRadius={10}
				elementsSelectable={false}
			>
				<Controls />
			</ReactFlow>
		</>
	);
};

export default observer(Milestones);
