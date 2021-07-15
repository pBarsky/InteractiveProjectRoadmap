import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import { useStore } from '../../../app/stores/store';
import styles from './ContextMenu.module.scss';

interface ContextMenuProps {
	children?: React.ReactNode;
}

const ContextMenu = ({ children }: ContextMenuProps): JSX.Element | null => {
	const { commonStore } = useStore();
	const { isContextMenuVisible, setIsContextMenuVisible, contextMenuLocation } = commonStore;

	const hide = useCallback(() => {
		isContextMenuVisible && setIsContextMenuVisible(false);
	}, [isContextMenuVisible]);

	useEffect(() => {
		document.addEventListener('click', hide);
		return (): void => {
			document.removeEventListener('click', hide);
		};
	});

	if (!isContextMenuVisible) {
		return null;
	}

	return (
		<div
			className={styles.wrapper}
			style={{
				transform: `translate(${contextMenuLocation.xOffset}px, ${contextMenuLocation.yOffset}px)`
			}}
		>
			{children}
		</div>
	);
};

export default observer(ContextMenu);
