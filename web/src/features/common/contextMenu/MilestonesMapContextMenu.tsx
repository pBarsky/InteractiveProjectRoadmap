import { observer } from 'mobx-react-lite';
import React from 'react';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { DefaultMilestoneFormValues, MilestoneFormValues } from '../../../app/models/milestone';
import { useStore } from '../../../app/stores/store';
import Loader from '../Loader';
import ContextMenu from './ContextMenu';
import ContextMenuOption from './ContextMenuOption';

const MilestonesMapContextMenu = (): JSX.Element => {
	const { milestoneStore, roadmapStore, flowStore } = useStore();
	const { addMilestone } = milestoneStore;
	const { selectedRoadmap } = roadmapStore;
	const { clickOnPaneLocation } = flowStore;

	if (!selectedRoadmap) {
		return <Loader />;
	}

	const addMilestoneOnClick = (): void => {
		const milestone: MilestoneFormValues = new DefaultMilestoneFormValues();
		milestone.name = defaultDict.pages.flowPane.defaultNewMilestoneName;
		milestone.parentProjectId = selectedRoadmap.id;
		milestone.posX = clickOnPaneLocation.x;
		milestone.posY = clickOnPaneLocation.y;
		addMilestone(milestone);
	};

	return (
		<ContextMenu>
			<ContextMenuOption
				label={defaultDict.pages.flowPane.contextMenu.addMilestone}
				onClick={addMilestoneOnClick}
			/>
		</ContextMenu>
	);
};

export default observer(MilestonesMapContextMenu);
