import { useState } from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Milestone } from '../../app/models/milestone';
import styles from './MilestoneListItem.module.scss';

interface MilestoneListItemProps {
  milestone: Milestone;
}

const MilestoneListItem = ({ milestone }: MilestoneListItemProps) => {
  const [isDetails, setDetails] = useState(false);
  const onClick = () => setDetails((lastState) => !lastState);

  return (
    <div
      onClick={onClick}
      className={isDetails ? [styles.details, styles.wrapper].join(' ') : styles.wrapper}
    >
      <div className={styles.primary}>{milestone.name}</div>
      <div className={[styles.secondary, styles.statusDiv].join(' ')}>
        {defaultDict.common.status[milestone.status]}
      </div>
      {milestone.endsOn && (
        <div className={styles.secondary}>{milestone.endsOn.toLocaleDateString()}</div>
      )}
      {isDetails && <div>{milestone.description}</div>}
    </div>
  );
};

export default MilestoneListItem;
