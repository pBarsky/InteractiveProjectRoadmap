import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Container } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import RoadmapCard from './RoadmapCard';

const RoadmapDetails = () => {
  const { roadmapStore } = useStore();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);

  useEffect(() => {
    if (id) {
      roadmapStore.loadRoadmap(id);
    }
  }, [roadmapStore, id]);

  if (!roadmapStore.selectedRoadmap) {
    return <Loader content={defaultDict.pages.dashboard.loading} />;
  }

  return (
    <Container textAlign='justified'>
      <RoadmapCard fluid roadmap={roadmapStore.selectedRoadmap} />
    </Container>
  );
};

export default observer(RoadmapDetails);
