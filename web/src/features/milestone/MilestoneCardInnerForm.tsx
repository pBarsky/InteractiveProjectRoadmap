import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues, Status } from '../../app/models/milestone';
import EditDeleteButtons from '../common/buttons/EditDeleteButtons';
import SaveCancelButtons from '../common/buttons/SaveCancelButtons';
import Field from '../common/inputs/Field';
import Form from '../common/inputs/Form';
import styles from './MilestoneCardInnerForm.module.scss';

interface MilestoneCardInnerFormProps {
	isEditing: boolean;
	onDelete(): Promise<void>;
	toggleEdit(): void;
}

const MilestoneCardInnerForm = ({
	values,
	onDelete,
	isEditing,
	isValid,
	toggleEdit,
	resetForm,
	submitForm
}: MilestoneCardInnerFormProps & FormikProps<MilestoneFormValues>): JSX.Element => {
	const {
		forms: { inputs }
	} = defaultDict;

	const shortenDescription = (description: string): string => {
		if (description.length < 40) {
			return description;
		}
		return `${description.slice(0, 40)}...`;
	};

	const displayedDescription = (): string => {
		if (isEditing) {
			return values.description ?? '';
		}

		return values.description ? shortenDescription(values.description!) : '';
	};

	const handleCancel = (): void => {
		resetForm();
		toggleEdit();
	};
	const handleEdit = async (): Promise<void> => {
		await submitForm();
		toggleEdit();
	};

	return (
		<>
			<Form className={`${styles.form} ${isEditing ? styles.editing : ''}`}>
				<div className={styles.dateWrapper}>
					{defaultDict.pages.milestone.to}
					<Field
						label={inputs.endsOn.labelText}
						name={inputs.endsOn.name}
						className={`${styles.date} ${styles.field}`}
						type='date'
						id={`${inputs.endsOn.name}milestonecard`}
						disabled={!isEditing}
					/>
				</div>
				<Field
					label={inputs.name.labelText}
					name={inputs.name.name}
					className={`${styles.name} ${styles.field}`}
					id={`${inputs.name.name}milestonecard`}
					required
					disabled={!isEditing}
				/>
				<Field
					label={inputs.status.labelText}
					className={`${styles.status} ${styles.field}`}
					type='select'
					options={[
						{ value: Status.Done, label: defaultDict.common.status[Status.Done] },
						{ value: Status.New, label: defaultDict.common.status[Status.New] },
						{
							value: Status.InProgress,
							label: defaultDict.common.status[Status.InProgress]
						}
					]}
					name={inputs.status.name}
					id={`${inputs.status.name}RoadmapCard`}
					disabled={!isEditing}
				/>
				{(values.description || isEditing) && (
					<Field
						label={inputs.description.labelText}
						className={`${styles.description} ${styles.field}`}
						type='textarea'
						name={inputs.description.name}
						id={`${inputs.description.name}RoadmapCard`}
						disabled={!isEditing}
						value={displayedDescription()}
					/>
				)}
				{!isEditing && <EditDeleteButtons onDelete={onDelete} toggleEdit={toggleEdit} />}
				{isEditing && (
					<SaveCancelButtons
						handleCancel={handleCancel}
						handleEdit={handleEdit}
						isValid={isValid}
					/>
				)}
			</Form>
		</>
	);
};

export default MilestoneCardInnerForm;
