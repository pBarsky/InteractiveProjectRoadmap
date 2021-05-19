import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Container, Divider, Header, Segment } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import RoadmapList from '../roadmaps/RoadmapList';

const Dashboard = () => {
  const { authStore, roadmapStore } = useStore();
  const { user } = authStore;

  useEffect(() => {
    roadmapStore.loadRoadmaps();
  }, [roadmapStore]);

  return (
    <Segment textAlign='center' vertical>
      <Container>
        <Header as='h2' style={{ fontSize: '3em', marginBottom: -10 }}>
          {defaultDict.pages.dashboard.greeting}
        </Header>
        <Header as='h1' style={{ fontSize: '3em', marginTop: 0 }}>
          {user?.displayName}
        </Header>
        <Divider />
        {roadmapStore.loading
          ? (
          <Loader
            content={defaultDict.pages.dashboard.loading}
            inline='centered'
          />
            )
          : (
          <RoadmapList />
            )}
      </Container>
    </Segment>
  );
};

export default observer(Dashboard);
