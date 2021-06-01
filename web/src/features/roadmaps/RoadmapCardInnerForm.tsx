import { faBan, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProps } from 'formik';
import React from 'react';
import Button from '../../app/common/buttons/Button';
import Field from '../../app/common/inputs/Field';
import defaultDict from '../../app/dictionaries/defaultDict';
import { RoadmapFormValues } from '../../app/models/roadmap';
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
  isEditing,
  handleSubmit,
  onDelete,
  toggleEdit,
  resetForm,
  submitForm
}: RoadmapCardInnerFormProps & FormikProps<RoadmapFormValues>) => {
  const {
    forms: { inputs },
    pages: { roadmap }
  } = defaultDict;

  const isLate: JSX.Element | null = isFailing ? <p>{roadmap.roadmapLate}</p> : null;
  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${isEditing ? styles.editing : ''}`}>
      <div className={styles.buttons}>
        <Button outlined onClick={toggleEdit} className={styles.editButton}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button outlined onClick={onDelete} className={styles.deleteButton}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
      <div className={styles.name}>
        <Field
          label={inputs.name.labelText}
          type='textarea'
          name={inputs.name.name}
          id={`${inputs.name.name}RoadmapCard`}
          required
          disabled={!isEditing}
        />
        {!isEditing && <span className={styles.late}>{isLate}</span>}
      </div>
      <div className={styles.dates}>
        <div className={styles.dateWrapper}>
          {!isEditing && <span>{roadmap.startsOn}</span>}
          <div className={styles.date}>
            <Field
              label={inputs.startsOn.labelText}
              name={inputs.startsOn.name}
              id={`${inputs.startsOn.name}RoadmapCard`}
              type='datetime-local'
              disabled={!isEditing}
              required
            />
          </div>
        </div>
        {(values.endsOn || isEditing) && (
          <div className={styles.dateWrapper}>
            {!isEditing && <span>{roadmap.endsOn}</span>}
            <div className={styles.date}>
              <Field
                label={inputs.endsOn.labelText}
                name={inputs.endsOn.name}
                type='datetime-local'
                id={`${inputs.endsOn.name}RoadmapCard`}
                disabled={!isEditing}
              />
            </div>
          </div>
        )}
      </div>
      <Field
        label={inputs.description.labelText}
        className={styles.description}
        type='textarea'
        name={inputs.description.name}
        id={`${inputs.description.name}RoadmapCard`}
        disabled={!isEditing}
      />
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

export default RoadmapCardInnerForm;
