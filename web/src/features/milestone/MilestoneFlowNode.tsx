import React from 'react';
import { FlowElement, Handle, Position } from 'react-flow-renderer';
import { HandleId, Milestone } from '../../app/models/milestone';
import MilestoneCard from './MilestoneCard';
import styles from './MilestoneFlowNode.module.scss';

const MilestoneFlowNode = (data: FlowElement<Milestone>): JSX.Element => {
	const milestoneFlowElement = data.data;
	return (
		<>
			<pre style={{ fontWeight: 'bold' }}>
				{'\n'}connectedToSourceHandleId: {milestoneFlowElement?.connectedToSourceHandleId}
				{'\n'}connectedToTargetHandleId: {milestoneFlowElement?.connectedToTargetHandleId}
				{'\n'}connectedToId: {milestoneFlowElement?.connectedToId}
			</pre>
			<>
				<Handle
					type='target'
					position={Position.Left}
					className={styles.handle}
					id={HandleId.Left.toString()}
				/>
				<span>Lewa T</span>
			</>
			<>
				<Handle
					type='source'
					position={Position.Left}
					className={styles.handle}
					id={HandleId.Left.toString()}
				/>
				<span style={{ marginLeft: 10 }}>Lewa S</span>
			</>

			<MilestoneCard milestone={milestoneFlowElement!} />
			<>
				<Handle
					type='target'
					position={Position.Right}
					className={styles.handle}
					id={HandleId.Right.toString()}
				/>
				<span>Prawa T</span>
			</>
			<>
				<Handle
					type='source'
					position={Position.Right}
					className={styles.handle}
					id={HandleId.Right.toString()}
				/>
				<span style={{ marginLeft: 10 }}>Prawa S</span>
			</>
		</>
	);
};

export default MilestoneFlowNode;
