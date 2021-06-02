import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Container } from 'semantic-ui-react';
import BackButton from '../../app/common/buttons/BackButton';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import AddMilestone from '../milestone/AddMilestone';
import RoadmapCard from './RoadmapCard';

const RoadmapDetails = () => {
  const { roadmapStore, milestoneStore } = useStore();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);

  useEffect(() => {
    if (id) {
      roadmapStore.loadRoadmap(id).then(() => milestoneStore.getAll(roadmapStore.selectedRoadmap!));
    }
  }, [roadmapStore, id]);

  if (!roadmapStore.selectedRoadmap) {
    return <Loader content={defaultDict.pages.roadmap.loadingDetails} />;
  }

  return (
    <Container>
      <RoadmapCard roadmap={roadmapStore.selectedRoadmap} />
      <AddMilestone roadmapId={id} />
      <BackButton />
    </Container>
  );
};

export default observer(RoadmapDetails);
