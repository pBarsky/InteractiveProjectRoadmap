import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactFlow, {
	Connection,
	ConnectionMode,
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
import MilestonesMapContextMenu from '../common/contextMenu/MilestonesMapContextMenu';
import Loader from '../common/Loader';
import ConnectionLine from '../flow/ConnectionLine';
import MilestoneFlowNode from './MilestoneFlowNode';
import styles from './Milestones.module.scss';

const generateStyles = (
	[x, y, scale]: Transform,
	backgroundImageSize: BackgroundSize,
	imageUrl?: string
): React.CSSProperties => {
	return {
		'--data-x': `${x}px`,
		'--data-y': `${y}px`,
		'--data-scale': scale,
		'--x-size': `${backgroundImageSize[0]}px`,
		'--y-size': `${backgroundImageSize[1]}px`,
		'--background-url': `url(${imageUrl || ''})`
	} as React.CSSProperties;
};

const Milestones = (): JSX.Element => {
	const { flowStore, milestoneStore, roadmapStore, commonStore } = useStore();
	const {
		flowElements,
		addConnection: addEdge,
		areNodesDraggableAndConnectable,
		SetClickOnPaneLocation
	} = flowStore;
	const { isLoading } = milestoneStore;
	const { backgroundImageSize, selectedRoadmap } = roadmapStore;
	const transformation = useStoreState((state) => state.transform);
	const { setContextMenuLocation, setIsContextMenuVisible } = commonStore;

	if (isLoading) {
		return <Loader />;
	}

	const onConnect = (edge: Edge<Milestone> | Connection): void => {
		addEdge(edge);
	};

	const onEdgeUpdate = (
		oldEdge: Edge<Milestone> | Connection,
		edge: Edge<Milestone> | Connection
	): void => {
		flowStore.updateConnection(oldEdge, edge);
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

	const onPaneContextMenu = (event: React.MouseEvent<Element, MouseEvent>): void => {
		event.preventDefault();
		const [paneX, paneY, paneScale] = transformation;
		const target = event.target as Element;
		const { x, y } = target.getBoundingClientRect();
		const { pageX, pageY, clientY } = event;
		const milestoneX = (pageX - x - paneX) / paneScale;
		const milestoneY = (clientY - y - paneY) / paneScale;
		setContextMenuLocation({ xOffset: pageX, yOffset: pageY });
		SetClickOnPaneLocation({ x: milestoneX, y: milestoneY });
		setIsContextMenuVisible(true);
	};

	return (
		<>
			{milestoneStore.milestones.length === 0 && (
				<h2>{defaultDict.pages.milestone.noMilestones}</h2>
			)}
			<ReactFlow
				className={styles.map}
				connectionLineComponent={ConnectionLine}
				connectionMode={ConnectionMode.Loose}
				edgeUpdaterRadius={10}
				elements={flowElements}
				elementsSelectable={false}
				minZoom={0}
				nodesDraggable={areNodesDraggableAndConnectable}
				nodesConnectable={areNodesDraggableAndConnectable}
				nodeTypes={nodeTypes}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectStop={onConnectStop}
				onEdgeDoubleClick={(_, edge): void => removeEdge(edge)}
				onEdgeUpdate={onEdgeUpdate}
				onEdgeUpdateEnd={onEdgeUpdateEnd}
				onNodeDragStop={moveMilestone}
				onPaneContextMenu={onPaneContextMenu}
				style={generateStyles(
					transformation,
					backgroundImageSize,
					selectedRoadmap?.imageUrl
				)}
				zoomOnDoubleClick={false}
				zoomOnScroll={false}
			>
				<Controls />
				<div className={styles.background} />
			</ReactFlow>
			<MilestonesMapContextMenu />
		</>
	);
};

export default observer(Milestones);
