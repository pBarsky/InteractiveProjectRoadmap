import format from 'date-fns/format';
import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import constants from '../../app/constants/constants';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone, MilestoneFormValues, Status } from '../../app/models/milestone';
import { useStore } from '../../app/stores/store';
import { milestoneFormValuesSchema } from '../../app/validationSchemas/milestoneSchemas';
import styles from './MilestoneCard.module.scss';
import MilestoneCardInnerForm from './MilestoneCardInnerForm';

interface MilestoneCardProps {
	milestone: Milestone;
	onSubmit?: (
		values: MilestoneFormValues,
		{ setErrors }: FormikHelpers<MilestoneFormValues>
	) => Promise<void>;
}

const MilestoneCard = ({ onSubmit, milestone }: MilestoneCardProps): JSX.Element => {
	const { milestoneStore } = useStore();
	const { isEditing, setIsEditing } = milestoneStore;
	const [isFormEditable, setIsFormEditable] = useState(false);
	const toggleEdit = (): void => {
		setIsFormEditable((oldState) => !oldState);
		setIsEditing(!isEditing);
	};

	const handleSubmit = async (
		values: MilestoneFormValues,
		{ setErrors }: FormikHelpers<MilestoneFormValues>
	): Promise<void> => {
		try {
			const updatedMilestone = new Milestone({
				...milestone,
				...values,
				status: Number(values.status),
				endsOn: values.endsOn ? new Date(values.endsOn) : null
			});
			await milestoneStore.updateMilestone(updatedMilestone);
		} catch {
			setErrors({ description: defaultDict.errors.milestones.failedEdit });
		}
	};

	const handleDelete = async (): Promise<void> => {
		await milestoneStore.deleteMilestone(milestone.id);
	};

	const statusClassName = ((): string => {
		const { status, endsOn } = milestone;
		const statusToStyleMap = {
			[Status.Done]: styles.done,
			[Status.InProgress]: styles.inProgress,
			[Status.New]: styles.new
		};

		if (status === Status.Done) {
			return statusToStyleMap[status];
		}

		if (endsOn && endsOn < new Date()) {
			return styles.failing;
		}

		return statusToStyleMap[status];
	})();

	return (
		<div className={`${styles.wrapper} ${statusClassName}`}>
			<Formik
				enableReinitialize
				validationSchema={milestoneFormValuesSchema}
				initialValues={{
					...milestone,
					endsOn: milestone.endsOn ? format(milestone.endsOn, constants.dateFormat) : ''
				}}
				onSubmit={onSubmit || handleSubmit}
				component={(props): JSX.Element => (
					<MilestoneCardInnerForm
						{...props}
						onDelete={handleDelete}
						isEditing={isFormEditable}
						toggleEdit={toggleEdit}
					/>
				)}
			/>
		</div>
	);
};

export default observer(MilestoneCard);
