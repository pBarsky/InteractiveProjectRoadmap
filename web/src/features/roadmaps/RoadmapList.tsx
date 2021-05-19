import { observer } from 'mobx-react-lite';
import React from 'react';
import { CardGroup, Header } from 'semantic-ui-react';
import { browserHistory } from '../../App';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import RoadmapCard from './RoadmapCard';

const RoadmapList = () => {
  const { roadmapStore } = useStore();
  if (roadmapStore.roadmaps.length === 0) {
    return (
      <Header size='huge'>
        {defaultDict.pages.roadmap.noRoadmaps}
        <br /> {defaultDict.pages.roadmap.proposalOfCreation}
      </Header>
    );
  }

  return (
    <CardGroup centered>
      {roadmapStore.roadmaps.map((roadmap) => (
        <RoadmapCard
          key={roadmap.id}
          onClick={() => {
            browserHistory.push(`${routes.roadmap.list}/${roadmap.id}`);
          }}
          roadmap={roadmap}
        />
      ))}
    </CardGroup>
  );
};

export default observer(RoadmapList);
