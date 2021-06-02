import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';

interface NotFoundProps {
	message?: string;
}
const NotFound = ({ message }: NotFoundProps) => {
	return (
		<Segment
			textAlign='center'
			vertical
			style={{
				display: ' flex',
				alignItems: 'center'
			}}
		>
			<Container>
				<Header as='h1'>{message ?? defaultDict.pages.notFound.message}</Header>
			</Container>
		</Segment>
	);
};

export default NotFound;
