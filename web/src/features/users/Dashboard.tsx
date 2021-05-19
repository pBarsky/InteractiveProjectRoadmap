import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';

const Dashboard = () => {
  const { authStore: userStore } = useStore();
  const { user } = userStore;
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
        <Button
          color='black'
          onClick={() => browserHistory.push(routes.api.roadmap.add)}>
          {defaultDict.forms.buttons.addNew.text}
        </Button>
      </Container>
    </Segment>
  );
};

export default observer(Dashboard);
