import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { DefaultRoadmapFormValues, RoadmapFormValues } from '../../app/models/roadmap';
import { useStore } from '../../app/stores/store';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';
import customErrorMessages from '../../app/validationSchemas/customErrorMessages';
import RoadmapInnerForm from './RoadmapInnerForm';

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
      component={RoadmapInnerForm}
    />
  );
};

export default observer(AddRoadmap);
