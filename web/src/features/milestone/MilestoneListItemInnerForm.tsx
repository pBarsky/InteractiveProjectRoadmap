import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Button from '../../app/common/buttons/Button';
import Field from '../../app/common/inputs/Field';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone } from '../../app/models/milestone';
import styles from './MilestoneListItem.module.scss';

interface MilestoneListItemProps {
  milestone: Milestone;
  isEditing: boolean;
  onDelete(): Promise<void>;
  toggleEdit(): void;
}

const MilestoneListItemInnerForm = ({
  milestone,
  onDelete,
  isEditing,
  toggleEdit
}: MilestoneListItemProps) => {
  const {
    forms: { inputs }
  } = defaultDict;
  const [isDetails, setDetails] = useState(false);
  const onClick = () => setDetails((lastState) => !lastState);
  return (
    <form onClick={onClick} className={`${styles.form} ${isEditing ? styles.editing : ''}`}>
      {isDetails && (
        <div className={styles.buttons}>
          <Button outlined onClick={toggleEdit} className={styles.editButton}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button outlined onClick={onDelete} className={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
      <div className={styles.primary}>
        <Field
          label={inputs.name.labelText}
          type='textarea'
          name={inputs.name.name}
          id={`${inputs.name.name}milestonelistitem`}
          required
          disabled={!isEditing}
        />
      </div>
      <div className={[styles.secondary, styles.statusDiv].join(' ')}>
        {defaultDict.common.status[milestone.status]}
      </div>
      {milestone.endsOn && (
        <div className={styles.secondary}>
          <Field
            label={inputs.endsOn.labelText}
            name={inputs.endsOn.name}
            type='datetime-local'
            id={`${inputs.endsOn.name}milestonelistitem`}
            disabled={!isEditing}
          />
        </div>
      )}
      {isDetails && (
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
    </form>
  );
};

export default MilestoneListItemInnerForm;
