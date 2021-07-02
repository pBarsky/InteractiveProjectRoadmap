import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import defaultDict from '../../app/dictionaries/defaultDict';
import Button from '../common/buttons/Button';
import styles from './AddMilestone.module.scss';
import AddMilestoneForm from './AddMilestoneForm';

interface AddMilestoneProps {
	roadmapId: number;
}

const AddMilestone = ({ roadmapId }: AddMilestoneProps): JSX.Element => {
	const [isAddMilestoneVisible, setIsAddMilestoneVisible] = useState(false);
	const [isAdding, setIsAdding] = useState(true);

	const toggleAddMilestoneForm = (): void => {
		setIsAddMilestoneVisible((oldState) => !oldState);
		setIsAdding((oldState) => !oldState);
	};

	return (
		<div className={styles.wrapper}>
			{isAdding && (
				<Button className={styles.addMilestoneButton} onClick={toggleAddMilestoneForm}>
					{defaultDict.forms.buttons.addNewMilestone.text}
				</Button>
			)}

			<CSSTransition
				in={isAddMilestoneVisible}
				timeout={200}
				classNames={{
					enter: styles.addMilestoneFormEnter,
					enterActive: styles.addMilestoneFormEnterActive,
					exit: styles.addMilestoneFormExit,
					exitActive: styles.addMilestoneFormExitActive
				}}
				unmountOnExit
			>
				<div className={styles.addMilestoneForm}>
					<AddMilestoneForm roadmapId={roadmapId} afterSubmit={toggleAddMilestoneForm} />
				</div>
			</CSSTransition>
		</div>
	);
};

export default AddMilestone;
