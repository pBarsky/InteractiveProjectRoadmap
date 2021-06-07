import React from 'react';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';
import Button from './Button';

interface BackButtonProps {
	content?: string;
	className?: string;
	backUrl?: string;
}

const BackButton = ({ content, backUrl, className }: BackButtonProps) => {
	const onClick = () => {
		if (backUrl) {
			browserHistory.push(backUrl);
			return;
		}
		browserHistory.goBack();
	};
	return (
		<Button className={className} outlined onClick={onClick}>
			{content ?? defaultDict.common.backButton}
		</Button>
	);
};

export default BackButton;
