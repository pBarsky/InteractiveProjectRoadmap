import format from 'date-fns/format';
import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import constants from '../../app/constants/constants';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Roadmap, RoadmapFormValues } from '../../app/models/roadmap';
import roadmapStore from '../../app/stores/roadmapStore';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';
import MilestonesList from '../milestone/MilestonesList';
import styles from './RoadmapCard.module.scss';
import RoadmapCardInnerForm from './RoadmapCardInnerForm';
interface RoadmapCardProps {
  roadmap: Roadmap;
  testDate?: Date;
  onSubmit?: (
    values: RoadmapFormValues,
    { setErrors }: FormikHelpers<RoadmapFormValues>
  ) => Promise<void>;
}

const RoadmapCard = ({ onSubmit, roadmap, testDate }: RoadmapCardProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((oldState) => !oldState);
  };

  let isFailing: boolean = false;
  if (roadmap.endsOn) {
    isFailing = (testDate ?? new Date()).getTime() > roadmap.endsOn.getTime();
  }

  const handleSubmit = async (
    values: RoadmapFormValues,
    { setErrors }: FormikHelpers<RoadmapFormValues>
  ) => {
    try {
      const updatedRoadmap: Roadmap = {
        id: roadmap.id,
        name: values.name,
        description: values.description,
        endsOn: values.endsOn ? new Date(values.endsOn) : null,
        startsOn: new Date(values.startsOn)
      };
      console.log(updatedRoadmap);
      await roadmapStore.updateRoadmap(updatedRoadmap);
    } catch {
      setErrors({ description: defaultDict.errors.roadmap.failedEdit });
    }
  };

  const handleDelete = async () => {};

  return (
    <div className={`${styles.wrapper} ${isFailing ? styles.failing : ''}`}>
      <Formik
        enableReinitialize
        validationSchema={roadmapFormValuesSchema}
        initialValues={{
          ...roadmap,
          startsOn: format(roadmap.startsOn, constants.dateTimeFormat),
          endsOn: roadmap.endsOn ? format(roadmap.endsOn, constants.dateTimeFormat) : ''
        }}
        onSubmit={onSubmit || handleSubmit}
        component={(props) => (
          <RoadmapCardInnerForm
            onDelete={handleDelete}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
            isFailing={isFailing}
            {...props}
          />
        )}
      />
      <div>
        <MilestonesList />
      </div>
    </div>
  );
};

export default RoadmapCard;
