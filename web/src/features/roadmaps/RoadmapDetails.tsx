import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Container, Header, Segment } from 'semantic-ui-react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';

const RoadmapDetails = () => {
  const { roadmapStore } = useStore();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);

  useEffect(() => {
    if (id) {
      try {
        roadmapStore.loadRoadmap(id);
      } catch {
        console.log('tutaj');
        browserHistory.push(routes.user.dashboard);
      }
    }
  }, [roadmapStore, id]);

  if (roadmapStore.isLoading || !roadmapStore.selectedRoadmap) {
    console.log('loadinmg');
    return <Loader content={defaultDict.pages.dashboard.loading} />;
  }

  const roadmap = roadmapStore.selectedRoadmap!;
  return (
    <Container>
      <Segment>
        <Header size='huge'>{roadmap.name}</Header>
        <Header size='large'>{roadmap.startsOn.toString()}</Header>
        <Header size='medium'>{roadmap.description}</Header>
      </Segment>
    </Container>
  );
};

export default observer(RoadmapDetails);
