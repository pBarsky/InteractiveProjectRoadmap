import React from 'react';
import { Button } from 'semantic-ui-react';
import { browserHistory } from '../../../App';
import defaultDict from '../../../app/dictionaries/defaultDict';

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
		<Button color='black' className={className} basic onClick={onClick}>
			{content ?? defaultDict.common.backButton}
		</Button>
	);
};

export default BackButton;
