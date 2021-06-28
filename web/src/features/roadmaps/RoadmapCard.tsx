import format from 'date-fns/format';
import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import constants from '../../app/constants/constants';
import defaultDict from '../../app/dictionaries/defaultDict';
import { Roadmap, RoadmapFormValues } from '../../app/models/roadmap';
import { useStore } from '../../app/stores/store';
import { roadmapFormValuesSchema } from '../../app/validationSchemas/roadmapSchemas';
import MilestonesList from '../milestone/MilestonesList';
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
	const { roadmapStore } = useStore();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => {
		setIsEditing((oldState) => !oldState);
	};
	const roadmap = roadmapStore.selectedRoadmap!;
	const roadmapDict = defaultDict.pages.roadmap;

	let isFailing: boolean = false;
	if (roadmap.endsOn) {
		isFailing = (testDate ?? new Date()).getTime() > roadmap.endsOn.getTime();
	}

	const handleSubmit = async (
		values: RoadmapFormValues,
		{ setErrors }: FormikHelpers<RoadmapFormValues>
	) => {
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

	const handleDelete = async () => {
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
				component={(props) => (
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
					<img src={roadmap.imageUrl} alt={roadmapDict.roadmapImageAltText} />
				</div>
			)}
			<ReactFlowProvider>
				<MilestonesList />
			</ReactFlowProvider>
		</div>
	);
};

export default observer(RoadmapCard);
