import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import styles from './Loader.module.scss';
interface LoaderProps {
	content?: string;
	page?: boolean;
}

const Loader = ({ content = defaultDict.common.loading, page = false }: LoaderProps): JSX.Element => {
	return (
		<div className={styles.dimmer} style={{ minHeight: page ? '100vh' : '20vh' }}>
			<div className={styles.wrapper}>
				<div className={styles.loader}></div>
				<div className={styles.content}>{content}</div>
			</div>
		</div>
	);
};

export default Loader;
