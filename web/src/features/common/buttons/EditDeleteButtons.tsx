import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import constants from '../../../app/constants/constants';
import Button from './Button';
import styles from './EditDeleteButtons.module.scss';

interface EditDeleteButtonsProps {
	wrapperClassName?: string;
	toggleEdit: () => void;
	onDelete: () => void;
}

const EditDeleteButtons = ({
	onDelete,
	toggleEdit,
	wrapperClassName
}: EditDeleteButtonsProps): JSX.Element => {
	return (
		<div className={wrapperClassName ?? styles.wrapper}>
			<div>
				<Button outlined onClick={onDelete} data-testid={constants.testIds.deleteButton}>
					<FontAwesomeIcon icon={faTrash} />
				</Button>
				<Button outlined onClick={toggleEdit} data-testid={constants.testIds.editButton}>
					<FontAwesomeIcon icon={faEdit} />
				</Button>
			</div>
		</div>
	);
};

export default EditDeleteButtons;
