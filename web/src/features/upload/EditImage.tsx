import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';
import Button from '../common/buttons/Button';
import styles from './EditImage.module.scss';
import UploadImage from './UploadImage';

const EditImage = () => {
	const { roadmapStore } = useStore();

	const [isUploadImageVisible, setIsUploadImageFormVisible] = useState(false);

	const toggleUploadImageForm = () => {
		setIsUploadImageFormVisible((oldState) => !oldState);
	};

	const selectedRoadmap = roadmapStore.selectedRoadmap!;
	const roadmapHasImage = !!selectedRoadmap.imageUrl;

	return (
		<div className={styles.wrapper}>
			<div className={styles.buttons}>
				{!isUploadImageVisible && (
					<Button className={styles.editButton} onClick={toggleUploadImageForm}>
						{roadmapHasImage
							? defaultDict.forms.buttons.editImage.text
							: defaultDict.forms.buttons.addImage.text}
					</Button>
				)}
				{roadmapHasImage && (
					<Button
						outlined
						className={styles.deleteButton}
						onClick={async () => await roadmapStore.deleteImage(selectedRoadmap!.id)}
					>
						{defaultDict.forms.buttons.deleteImage.text}
					</Button>
				)}
			</div>
			{isUploadImageVisible && (
				<div className={styles.uploadImageForm}>
					<UploadImage hideForm={() => setIsUploadImageFormVisible(false)} />
				</div>
			)}
		</div>
	);
};

export default observer(EditImage);
