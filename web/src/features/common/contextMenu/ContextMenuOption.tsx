import React from 'react';
import styles from './ContextMenuOption.module.scss';

interface ContextMenuOptionProps {
	label: string;
	onClick(): void;
}

const ContextMenuOption = ({ label, onClick }: ContextMenuOptionProps): JSX.Element => {
	return (
		<div className={styles.option} onClick={onClick}>
			{label}
		</div>
	);
};

export default ContextMenuOption;
