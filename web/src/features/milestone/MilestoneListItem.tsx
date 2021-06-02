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

const MilestoneListItem = ({ onSubmit, milestone }: MilestoneListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((oldState) => !oldState);
  };

  const handleSubmit = async (
    values: MilestoneFormValues,
    { setErrors }: FormikHelpers<MilestoneFormValues>
  ) => {
    try {
      const updatedMilestone: Milestone = {
        id: milestone.id,
        parentProjectId: milestone.parentProjectId,
        name: values.name,
        description: values.description,
        endsOn: values.endsOn ? new Date(values.endsOn) : null,
        status: milestone.status
      };
      await milestoneStore.updateMilestone(updatedMilestone);
    } catch {
      setErrors({ description: defaultDict.errors.milestones.failedEdit });
    }
  };

  const handleDelete = async () => {
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
        component={(props) => (
          <MilestoneListItemInnerForm
            onDelete={handleDelete}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
            {...props}
          />
        )}
      />
    </div>
  );
};

export default MilestoneListItem;
