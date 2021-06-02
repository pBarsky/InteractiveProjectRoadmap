import React from 'react';
import { Button } from 'semantic-ui-react';
import { browserHistory } from '../../../App';
import defaultDict from '../../dictionaries/defaultDict';

interface BackButtonProps {
	content?: string;
	className?: string;
}

const BackButton = ({ content, className }: BackButtonProps) => {
	return (
		<Button color='black' className={className} basic onClick={() => browserHistory.goBack()}>
			{content ?? defaultDict.common.backButton}
		</Button>
	);
};

export default BackButton;
