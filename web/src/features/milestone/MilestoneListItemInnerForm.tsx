import { faBan, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProps } from 'formik';
import React, { useState } from 'react';
import Button from '../../app/common/buttons/Button';
import Field from '../../app/common/inputs/Field';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues } from '../../app/models/milestone';
import styles from './MilestoneListItem.module.scss';

interface MilestoneListItemProps {
  isEditing: boolean;
  onDelete(): Promise<void>;
  toggleEdit(): void;
}

const MilestoneListItemInnerForm = ({
  values,
  onDelete,
  isEditing,
  toggleEdit,
  resetForm,
  submitForm
}: MilestoneListItemProps & FormikProps<MilestoneFormValues>) => {
  const {
    forms: { inputs }
  } = defaultDict;
  const [isDetails, setDetails] = useState(false);
  const onClick = () => setDetails(true);
  return (
    <form onClick={onClick} className={`${styles.form} ${isEditing ? styles.editing : ''}`}>
      {(isDetails || isEditing) && (
        <div className={styles.buttons}>
          <Button outlined onClick={toggleEdit} className={styles.editButton}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button outlined onClick={onDelete} className={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
      {(isDetails || isEditing) && (
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
      {(values.endsOn || isEditing) && (
        <div className={styles.dateWrapper}>
          <div className={styles.date}>
            <Field
              label={inputs.endsOn.labelText}
              name={inputs.endsOn.name}
              type='datetime-local'
              id={`${inputs.endsOn.name}milestonelistitem`}
              disabled={!isEditing}
            />
          </div>
        </div>
      )}
      {(isDetails || isEditing) && (
        <div>
          <Field
            label={inputs.description.labelText}
            className={styles.description}
            type='textarea'
            name={inputs.description.name}
            id={`${inputs.description.name}RoadmapCard`}
            disabled={!isEditing}
          />
        </div>
      )}
      {isEditing && (
        <div className={styles.buttons}>
          <Button
            type='submit'
            onClick={async () => {
              await submitForm();
              toggleEdit();
            }}
            className={styles.saveButton}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            onClick={() => {
              resetForm();
              toggleEdit();
            }}
            type='reset'
            className={styles.cancelButton}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      )}
    </form>
  );
};

export default MilestoneListItemInnerForm;
