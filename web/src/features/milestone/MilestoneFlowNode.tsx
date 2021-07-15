import React from 'react';
import { FlowElement, Handle, Position } from 'react-flow-renderer';
import { HandleId, Milestone } from '../../app/models/milestone';
import MilestoneCard from './MilestoneCard';
import styles from './MilestoneFlowNode.module.scss';

const MilestoneFlowNode = (data: FlowElement<Milestone>): JSX.Element => {
	const milestoneFlowElement = data.data;
	return (
		<>
			<Handle
				type='target'
				position={Position.Left}
				className={styles.handle}
				id={HandleId.Left.toString()}
			/>
			<Handle
				type='source'
				position={Position.Left}
				className={styles.handle}
				id={HandleId.Left.toString()}
			/>

			<MilestoneCard milestone={milestoneFlowElement!} />
			<Handle
				type='target'
				position={Position.Right}
				className={styles.handle}
				id={HandleId.Right.toString()}
			/>
			<Handle
				type='source'
				position={Position.Right}
				className={styles.handle}
				id={HandleId.Right.toString()}
			/>
		</>
	);
};

export default MilestoneFlowNode;
