import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styles from './DropdownMenu.module.scss';

interface DropdownMenuProps extends React.ComponentPropsWithRef<'div'> {
	text?: string;
}

const DropdownMenu = ({ children, text }: DropdownMenuProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const menuClassNames = [styles.menu, isOpen ? styles.visible : ''].join(' ');

	const caret = isOpen ? faCaretUp : faCaretDown;

	return (
		<div className={styles.dropdown} onClick={() => setIsOpen((state) => !state)}>
			<div className={styles.text}>
				{text} <FontAwesomeIcon className={styles.icon} icon={caret} />
			</div>
			<div className={menuClassNames}>
				<FontAwesomeIcon className={styles.menuCaret} icon={faCaretUp} />
				{children}
			</div>
		</div>
	);
};

export default DropdownMenu;
