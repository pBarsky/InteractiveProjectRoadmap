import { faBan, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { RoadmapFormValues } from '../../app/models/roadmap';
import Button from '../common/buttons/Button';
import Field from '../common/inputs/Field';
import Form from '../common/inputs/Form';
import styles from './RoadmapCardInnerForm.module.scss';

interface RoadmapCardInnerFormProps {
	isFailing: boolean;
	isEditing: boolean;
	onDelete(): Promise<void>;
	toggleEdit(): void;
}

const RoadmapCardInnerForm = ({
	values,
	isFailing,
	isValid,
	isEditing,
	handleSubmit,
	onDelete,
	handleReset,
	toggleEdit
}: RoadmapCardInnerFormProps & FormikProps<RoadmapFormValues>): JSX.Element => {
	const {
		forms: { inputs },
		pages: { roadmap }
	} = defaultDict;

	const toggleEditAndResetForm = (): void => {
		handleReset();
		toggleEdit();
	};

	const onSubmit = async (): Promise<void> => {
		handleSubmit();
		toggleEdit();
	};

	const truncatedDescription = (): string => {
		if (isEditing) {
			return values.description ?? '';
		}

		if (!values.description) {
			return '';
		}

		return values.description.length > 150
			? `${values.description.slice(0, 150)}...`
			: values.description;
	};

	const isLate: JSX.Element | null = isFailing ? <p>{roadmap.roadmapLate}</p> : null;
	return (
		<Form
			onSubmit={onSubmit}
			onReset={toggleEditAndResetForm}
			className={`${styles.form} ${isEditing ? styles.editing : ''}`}
		>
			<div className={styles.roadmapData}>
				<div className={styles.nameAndDescription}>
					<div className={styles.name}>
						<Field
							label={inputs.name.labelText}
							name={inputs.name.name}
							id={`${inputs.name.name}RoadmapCard`}
							required
							disabled={!isEditing}
						/>
						{!isEditing && <span className={styles.late}>{isLate}</span>}
					</div>
					<div className={styles.description}>
						<Field
							label={inputs.description.labelText}
							type='textarea'
							name={inputs.description.name}
							id={`${inputs.description.name}RoadmapCard`}
							textareaCharactersInARow={80}
							disabled={!isEditing}
							value={truncatedDescription()}
						/>
					</div>
				</div>
				<div className={styles.dates}>
					<div className={styles.startDate}>
						{!isEditing && <span>{roadmap.startsOn}</span>}
						<Field
							label={inputs.startsOn.labelText}
							name={inputs.startsOn.name}
							id={`${inputs.startsOn.name}RoadmapCard`}
							type='date'
							disabled={!isEditing}
							required
						/>
					</div>
					<div className={styles.endDate}>
						{!isEditing && <span>{roadmap.endsOn}</span>}
						<Field
							label={inputs.endsOn.labelText}
							name={inputs.endsOn.name}
							type='date'
							id={`${inputs.endsOn.name}RoadmapCard`}
							disabled={!isEditing}
						/>
					</div>
				</div>

				{!isEditing && (
					<div className={styles.buttons}>
						<Button
							outlined
							onClick={toggleEditAndResetForm}
							className={styles.editButton}
						>
							<FontAwesomeIcon icon={faEdit} />
						</Button>
						<Button outlined onClick={onDelete} className={styles.deleteButton}>
							<FontAwesomeIcon icon={faTrash} />
						</Button>
					</div>
				)}

				{isEditing && (
					<div className={`${styles.buttons} ${styles.editButtons}`}>
						<Button type='submit' disabled={!isValid} className={styles.saveButton}>
							<FontAwesomeIcon icon={faCheck} />
						</Button>
						<Button type='reset' outlined className={styles.cancelButton}>
							<FontAwesomeIcon icon={faBan} />
						</Button>
					</div>
				)}
			</div>
		</Form>
	);
};

export default RoadmapCardInnerForm;
