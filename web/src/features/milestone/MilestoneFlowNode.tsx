import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FlowElement, Handle, Position } from 'react-flow-renderer';
import { Milestone } from '../../app/models/milestone';
import MilestoneCard from './MilestoneCard';
import styles from './MilestoneFlowNode.module.scss';

const MilestoneFlowNode = (data: FlowElement<Milestone>): JSX.Element => {
	return (
		<>
			<Handle type='target' position={Position.Left} className={styles.handle}>
				<FontAwesomeIcon icon={faArrowCircleRight} />
			</Handle>
			<MilestoneCard milestone={data.data!} />
			<Handle type='source' position={Position.Right} className={styles.handle}>
				<FontAwesomeIcon icon={faArrowCircleRight} />
			</Handle>
		</>
	);
};

export default MilestoneFlowNode;
