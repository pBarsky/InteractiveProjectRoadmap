import format from 'date-fns/format';
import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import constants from '../../app/constants/constants';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Roadmap, RoadmapFormValues } from '../../app/models/roadmap';
import { useStore } from '../../app/stores/store';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';
import AddMilestone from '../milestone/AddMilestone';
import MilestonesFlowMap from '../milestone/MilestonesFlowMap';
import EditImage from '../upload/EditImage';
import styles from './RoadmapCard.module.scss';
import RoadmapCardInnerForm from './RoadmapCardInnerForm';
interface RoadmapCardProps {
	testDate?: Date;
	onSubmit?: (
		values: RoadmapFormValues,
		{ setErrors }: FormikHelpers<RoadmapFormValues>
	) => Promise<void>;
}

const RoadmapCard = ({ onSubmit, testDate }: RoadmapCardProps): JSX.Element => {
	const { roadmapStore, milestoneStore } = useStore();
	const { setIsEditing: setIsMilestoneEditing } = milestoneStore;
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = (): void => {
		setIsEditing((oldState) => !oldState);
	};

	useEffect(() => {
		setIsMilestoneEditing(false);
	}, []);

	const roadmap = roadmapStore.selectedRoadmap!;
	const roadmapDict = defaultDict.pages.roadmap;

	let isFailing = false;
	if (roadmap.endsOn) {
		isFailing = (testDate ?? new Date()).getTime() > roadmap.endsOn.getTime();
	}

	const handleSubmit = async (
		values: RoadmapFormValues,
		{ setErrors }: FormikHelpers<RoadmapFormValues>
	): Promise<void> => {
		try {
			const updatedRoadmap: Roadmap = {
				...roadmap,
				name: values.name,
				description: values.description,
				endsOn: values.endsOn ? new Date(values.endsOn) : null,
				startsOn: new Date(values.startsOn)
			};
			await roadmapStore.updateRoadmap(updatedRoadmap);
		} catch {
			setErrors({ description: defaultDict.errors.roadmap.failedEdit });
		}
	};

	const handleDelete = async (): Promise<void> => {
		await roadmapStore.deleteRoadmap(roadmap.id);
	};

	return (
		<div className={`${styles.wrapper} ${isFailing ? styles.failing : ''}`}>
			<Formik
				enableReinitialize
				validationSchema={roadmapFormValuesSchema}
				initialValues={{
					...roadmap,
					startsOn: format(roadmap.startsOn, constants.dateFormat),
					endsOn: roadmap.endsOn ? format(roadmap.endsOn, constants.dateFormat) : ''
				}}
				onSubmit={onSubmit || handleSubmit}
				component={(props): JSX.Element => (
					<RoadmapCardInnerForm
						{...props}
						onDelete={handleDelete}
						isEditing={isEditing}
						toggleEdit={toggleEdit}
						isFailing={isFailing}
					/>
				)}
			/>
			<EditImage />
			{roadmap.imageUrl && (
				<div className={styles.backgroundImage}>
					<img
						src={roadmap.imageUrl}
						alt={roadmapDict.roadmapImageAltText}
						onLoad={({ currentTarget: { naturalWidth, naturalHeight } }): void =>
							roadmapStore.setBackgroundImageSize([naturalWidth, naturalHeight])
						}
					/>
				</div>
			)}
			<div className={styles.milestones}>
				<div className={styles.milestonesHeader}>
					<span>{defaultDict.pages.roadmap.milestonesHeader}</span>
					<AddMilestone roadmapId={roadmap.id} />
				</div>
				<MilestonesFlowMap />
			</div>
		</div>
	);
};

export default observer(RoadmapCard);
