import { FormikHelpers } from 'formik';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { DefaultRoadmap, Roadmap } from '../../app/models/roadmap';
import { useStore } from '../../app/stores/store';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';

const roadmapInitialValues: Roadmap = new DefaultRoadmap();

interface RoadmapProps {
  onSubmit?: (
    values: Roadmap,
    actions: FormikHelpers<Roadmap>
  ) => Promise<void>;
}

const AddRoadmap = ({ onSubmit }: RoadmapProps) => {
  const { roadmapStore } = useStore();

  const handleSubmit = async (
      values: Roadmap,
      { setErrors }: FormikHelpers<Roadmap>
  ) => {
    try {
      await roadmapStore.addRoadmap(values);
    } catch {
      setErrors( );
    }
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
