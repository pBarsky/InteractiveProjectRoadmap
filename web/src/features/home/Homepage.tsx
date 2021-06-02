import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import routes from '../../app/common/routing/routes';
import defaultDict from '../../app/dictionaries/defaultDict';
import { useStore } from '../../app/stores/store';

const Homepage = () => {
	const {
		authStore: { isLoggedIn }
	} = useStore();

	if (isLoggedIn) {
		return <Redirect to={routes.user.dashboard} />;
	}

	return (
		<Segment textAlign='center' vertical>
			<Container text>
				<Segment basic style={{ fontSize: '2em' }}>
					<Header
						size='medium'
						as='h2'
						style={{ marginBottom: -15, textDecoration: 'underline' }}
					>
						{defaultDict.common.welcomeMessage}
					</Header>
					<Header size='huge' as='h1' style={{ marginTop: 0 }}>
						{defaultDict.common.appName}
					</Header>
				</Segment>
				<Button as={Link} to={routes.auth.login} size='huge' color='black'>
					{defaultDict.forms.buttons.login.text}
				</Button>
			</Container>
		</Segment>
	);
};

export default observer(Homepage);
