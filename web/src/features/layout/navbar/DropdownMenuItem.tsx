import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './DropdownMenuItem.module.scss';

interface DropdownMenuItemProps extends React.ComponentPropsWithRef<'div'> {
	icon?: IconProp;
}

const DropdownMenuItem = ({ children, icon, ...props }: DropdownMenuItemProps) => {
	const itemIcon = icon ? <FontAwesomeIcon className={styles.icon} icon={icon} /> : null;

	return (
		<div className={styles.item} {...props}>
			{itemIcon}
			{children}
		</div>
	);
};

export default DropdownMenuItem;
