import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import constants from '../../../app/constants/constants';
import Button from './Button';
import styles from './SaveCancelButtons.module.scss';

interface SaveCancelButtonsProps {
	wrapperClassName?: string;
	handleEdit: () => void;
	handleCancel: () => void;
	isValid: boolean;
}

const SaveCancelButtons = ({
	handleCancel,
	handleEdit,
	isValid,
	wrapperClassName
}: SaveCancelButtonsProps): JSX.Element => {
	return (
		<div className={wrapperClassName ?? styles.wrapper}>
			<div>
				<Button
					outlined
					onClick={handleCancel}
					data-testid={constants.testIds.cancelButton}
				>
					<FontAwesomeIcon icon={faBan} />
				</Button>
				<Button
					outlined
					onClick={handleEdit}
					disabled={!isValid}
					data-testid={constants.testIds.saveButton}
				>
					<FontAwesomeIcon icon={faCheck} />
				</Button>
			</div>
		</div>
	);
};

export default SaveCancelButtons;
