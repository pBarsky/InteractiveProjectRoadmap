import defaultDict from '../../app/dictionaries/defaultDict';
import { Roadmap } from '../../app/models/roadmap';
import styles from './RoadmapListItem.module.scss';

interface RoadmapListItemProps {
  onClick?: () => void;
  roadmap: Roadmap;
  testDate?: Date;
}

const RoadmapListItem = ({ onClick, roadmap, testDate }: RoadmapListItemProps) => {
  let isFailing: boolean = false;
  if (roadmap.endsOn) {
    isFailing = (testDate ?? new Date()).getTime() > roadmap.endsOn.getTime();
  }
  return (
    <div onClick={onClick} className={`${styles.wrapper} ${isFailing ? styles.failing : ''}`}>
      <div className={styles.name}>
        <h1>{roadmap.name}</h1>
      </div>
      <div className={styles.dates}>
        <div className={styles.dateWrapper}>
          {defaultDict.pages.roadmap.startsOn}
          <div className={styles.date}>{roadmap.startsOn.toLocaleString()}</div>
        </div>
        {roadmap.endsOn && (
          <div className={styles.dateWrapper}>
            {defaultDict.pages.roadmap.endsOn}
            <div className={styles.date}>{roadmap.endsOn.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapListItem;
