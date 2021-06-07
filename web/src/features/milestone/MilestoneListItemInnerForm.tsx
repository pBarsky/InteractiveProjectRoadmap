import { faBan, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues } from '../../app/models/milestone';
import Button from '../common/buttons/Button';
import Field from '../common/inputs/Field';
import styles from './MilestoneListItemInnerForm.module.scss';

interface MilestoneListItemProps {
	isEditing: boolean;
	onDelete(): Promise<void>;
	toggleEdit(): void;
}

const MilestoneListItemInnerForm = ({
	values,
	onDelete,
	isEditing,
	isValid,
	toggleEdit,
	resetForm,
	submitForm
}: MilestoneListItemProps & FormikProps<MilestoneFormValues>) => {
	const {
		forms: { inputs }
	} = defaultDict;

	const handleCancel = () => {
		resetForm();
		toggleEdit();
	};
	const handleEdit = async () => {
		await submitForm();
		toggleEdit();
	};
	return (
		<>
			<div className={styles.buttons}>
				<Button outlined onClick={toggleEdit} className={styles.editButton}>
					<FontAwesomeIcon icon={faEdit} />
				</Button>
				<Button outlined onClick={onDelete} className={styles.deleteButton}>
					<FontAwesomeIcon icon={faTrash} />
				</Button>
			</div>
			<form className={`${styles.form} ${isEditing ? styles.editing : ''}`}>
				{isEditing && (
					<div className={styles.status}>
						{inputs.status.labelText}: {defaultDict.common.status[values.status]}
					</div>
				)}
				<div className={styles.name}>
					<Field
						label={inputs.name.labelText}
						type='textarea'
						name={inputs.name.name}
						id={`${inputs.name.name}milestonelistitem`}
						required
						disabled={!isEditing}
					/>
				</div>
				<div className={styles.date}>
					<Field
						label={inputs.endsOn.labelText}
						name={inputs.endsOn.name}
						type='date'
						id={`${inputs.endsOn.name}milestonelistitem`}
						disabled={!isEditing}
					/>
				</div>

				{(isEditing || values.description) && (
					<Field
						label={inputs.description.labelText}
						className={styles.description}
						type='textarea'
						name={inputs.description.name}
						id={`${inputs.description.name}RoadmapCard`}
						disabled={!isEditing}
					/>
				)}
				{isEditing && (
					<div className={`${styles.buttons} ${styles.editButtons}`}>
						<Button
							onClick={handleEdit}
							disabled={!isValid}
							className={styles.saveButton}
						>
							<FontAwesomeIcon icon={faCheck} />
						</Button>
						<Button onClick={handleCancel} className={styles.cancelButton}>
							<FontAwesomeIcon icon={faBan} />
						</Button>
					</div>
				)}
			</form>
		</>
	);
};

export default MilestoneListItemInnerForm;
