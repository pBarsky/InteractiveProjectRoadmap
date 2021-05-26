import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  DefaultMilestoneFormValues,
  MilestoneFormValues
} from '../../app/models/milestone';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { milestoneFormValuesSchema } from '../../app/validationSchemas/milestoneSchemas';
import AddMilestoneInnerForm from './AddMilestoneInnerForm';

const milestoneInitialValues: MilestoneFormValues = new DefaultMilestoneFormValues();

interface MilestoneProps {
  onSubmit?: (
    values: MilestoneFormValues,
    actions: FormikHelpers<MilestoneFormValues>
  ) => Promise<void>;
}

const AddMilestone = ({ onSubmit }: MilestoneProps) => {
  const { milestoneStore } = useStore();

  const handleSubmit = async (
    values: MilestoneFormValues,
    { setErrors }: FormikHelpers<MilestoneFormValues>
  ) => {
    try {
      values.endsOn = new Date(values.endsOn).toISOString();
      await milestoneStore.addMilestone(values);
    } catch {
      setErrors({ commonFormError: customErrorMessages.common.failedAddMilestone });
    }
  };

  return (
    <Formik
      initialValues={milestoneInitialValues}
      onSubmit={onSubmit ?? handleSubmit}
      validateOnMount
      validationSchema={milestoneFormValuesSchema}
      component={AddMilestoneInnerForm}
    />
  );
};

export default observer(AddMilestone);
