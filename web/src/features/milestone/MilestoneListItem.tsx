import format from 'date-fns/format';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import constants from '../../app/constants/constants';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone, MilestoneFormValues } from '../../app/models/milestone';
import milestoneStore from '../../app/stores/milestoneStore';
import { milestoneFormValuesSchema } from '../../app/validationSchemas/milestoneSchemas';
import styles from './MilestoneListItem.module.scss';
import MilestoneListItemInnerForm from './MilestoneListItemInnerForm';

interface MilestoneListItemProps {
	milestone: Milestone;
	onSubmit?: (
		values: MilestoneFormValues,
		{ setErrors }: FormikHelpers<MilestoneFormValues>
	) => Promise<void>;
}

const MilestoneListItem = ({ onSubmit, milestone }: MilestoneListItemProps): JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = (): void => {
		setIsEditing((oldState) => !oldState);
	};

	const handleSubmit = async (
		values: MilestoneFormValues,
		{ setErrors }: FormikHelpers<MilestoneFormValues>
	): Promise<void> => {
		try {
			const updatedMilestone: Milestone = {
				...milestone,
				name: values.name,
				description: values.description,
				endsOn: values.endsOn ? new Date(values.endsOn) : null
			};
			await milestoneStore.updateMilestone(updatedMilestone);
		} catch {
			setErrors({ description: defaultDict.errors.milestones.failedEdit });
		}
	};

	const handleDelete = async (): Promise<void> => {
		await milestoneStore.deleteMilestone(milestone.id);
	};

	return (
		<div className={`${styles.wrapper}`}>
			<Formik
				enableReinitialize
				validationSchema={milestoneFormValuesSchema}
				initialValues={{
					...milestone,
					endsOn: milestone.endsOn ? format(milestone.endsOn, constants.dateFormat) : ''
				}}
				onSubmit={onSubmit || handleSubmit}
				component={(props): JSX.Element => (
					<MilestoneListItemInnerForm
						{...props}
						onDelete={handleDelete}
						isEditing={isEditing}
						toggleEdit={toggleEdit}
					/>
				)}
			/>
		</div>
	);
};

export default MilestoneListItem;
