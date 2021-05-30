import { observer } from 'mobx-react-lite';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import MilestoneListItem from './MilestoneListItem';

const MilestonesList = () => {
  const { milestoneStore } = useStore();
  const { milestones } = milestoneStore;
  if (milestoneStore.milestones.length === 0) {
    return <h2>{defaultDict.pages.milestone.noMilestones}</h2>;
  }
  return (
    <div>
      {milestones
        .slice()
        .sort((m1, m2) => m1.endsOn!.getTime() - m2.endsOn!.getTime())
        .map((milestone) => (
          <MilestoneListItem key={milestone.id} milestone={milestone} />
        ))}
    </div>
  );
};

export default observer(MilestonesList);
