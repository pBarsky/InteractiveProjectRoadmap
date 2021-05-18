import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Card, Container, Header, Segment } from 'semantic-ui-react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';

const Dashboard = () => {
  const { authStore, roadmapStore } = useStore();
  const { user } = authStore;
  useEffect(() => {
    roadmapStore.loadRoadmaps();
  }, [roadmapStore]);

  if (roadmapStore.isLoading) {
    return <Loader content={defaultDict.pages.dashboard.loading} />;
  }

  return (
    <Segment
      textAlign='center'
      vertical
      style={{
        display: ' flex',
        alignItems: 'center'
      }}>
      <Container>
        <Header as='h2'>{defaultDict.pages.dashboard.greeting}</Header>
        <Header as='h1' style={{ fontSize: '3em', marginTop: 0 }}>
          {user?.displayName}
        </Header>
        {roadmapStore.roadmaps.map((roadmap) => (
          <Card
            key={roadmap.id}
            onClick={() => {
              browserHistory.push(`${routes.roadmaps.roadmap}/${roadmap.id}`);
            }}>
            <Card.Content>
              <Card.Header>{roadmap.name}</Card.Header>
              <Card.Meta>Starts on: {roadmap.startsOn.toString()}</Card.Meta>
            </Card.Content>
            <Card.Content>{roadmap.description ?? ''}</Card.Content>
          </Card>
        ))}
      </Container>
    </Segment>
  );
};

export default observer(Dashboard);
