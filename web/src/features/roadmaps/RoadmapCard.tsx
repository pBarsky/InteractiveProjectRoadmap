import { Card, Divider } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Roadmap } from '../../app/models/roadmap';

interface RoadmapCardProps {
  onClick?: () => void;
  roadmap: Roadmap;
  fluid?: boolean;
  testDate?: Date;
}

const RoadmapCard = ({
  onClick,
  roadmap,
  testDate,
  fluid = false
}: RoadmapCardProps) => {
  let isFailing: boolean = false;
  if (roadmap.endsOn) {
    isFailing = (testDate ?? new Date()).getTime() > roadmap.endsOn.getTime();
  }

  const shortcutDescription = (desc: string | null) => {
    if (!desc) {
      return desc;
    }
    if (desc.length < 100) {
      return desc;
    }

    return `${desc.slice(0, 100)}...`;
  };

  const isLate: JSX.Element | null = isFailing
    ? (
    <Card.Meta textAlign='center'>
      {defaultDict.pages.roadmap.roadmapLate}
    </Card.Meta>
      )
    : null;

  return (
    <Card
      fluid={fluid}
      onClick={onClick}
      color={isFailing ? 'red' : undefined}
      style={{ padding: fluid ? '20px' : '' }}>
      <Card.Content>
        <Card.Header textAlign='center'>{roadmap.name}</Card.Header>
        {isLate}
        <Card.Meta textAlign='center'>
          {defaultDict.pages.roadmap.startsOn}
          {roadmap.startsOn.toLocaleString()}
        </Card.Meta>
        {roadmap.endsOn && (
          <Card.Meta textAlign='center'>
            {defaultDict.pages.roadmap.endsOn}
            {roadmap.endsOn.toLocaleString()}
          </Card.Meta>
        )}
        <Divider />
        <Card.Description
          textAlign='center'
          style={{
            maxHeight: !fluid ? '20ch' : '',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          {fluid
            ? roadmap.description
            : shortcutDescription(roadmap.description)}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default RoadmapCard;
