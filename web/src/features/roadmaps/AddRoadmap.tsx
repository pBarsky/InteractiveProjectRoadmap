import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DefaultRoadmapFormValues, RoadmapFormValues } from '../../app/models/roadmap';
import { useStore } from '../../app/stores/store';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';
import AddRoadmapInnerForm from './AddRoadmapInnerForm';

const roadmapInitialValues: RoadmapFormValues = new DefaultRoadmapFormValues();

interface RoadmapProps {
  onSubmit?: (
    values: RoadmapFormValues,
    actions: FormikHelpers<RoadmapFormValues>
  ) => Promise<void>;
}

const AddRoadmap = ({ onSubmit }: RoadmapProps) => {
  const { roadmapStore } = useStore();

  const handleSubmit = async (
    values: RoadmapFormValues,
    { setErrors }: FormikHelpers<RoadmapFormValues>
  ) => {
    try {
      values.startsOn = new Date(values.startsOn).toISOString();
      values.endsOn = values.endsOn ? new Date(values.endsOn).toISOString() : null;
      await roadmapStore.addRoadmap(values);
    } catch {
      setErrors({ commonFormError: customErrorMessages.common.failedAdd });
    }
  };

  return (
    <Formik
      initialValues={roadmapInitialValues}
      onSubmit={onSubmit ?? handleSubmit}
      validateOnMount
      validationSchema={roadmapFormValuesSchema}
      component={AddRoadmapInnerForm}
    />
  );
};

export default observer(AddRoadmap);
