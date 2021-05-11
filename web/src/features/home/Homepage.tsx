import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Segment } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'
/*
 * strona główna, napis z przywitaniem i link do logowania/rejestracji
 */

const Homepage = () => {
  const { userStore } = useStore()

  return (
    <Segment textAlign='center' vertical>
      <Container text>
        <Header size='huge'>Roadmap</Header>
        <Header size='medium'>Welcome to Roadmap</Header>
        {userStore.isLoggedIn
          ? (
          <Button as={Link} to='/dashboard' size='huge' color='black'>
            Go to dashboard
          </Button>
            )
          : (
          <Button as={Link} to='/login' size='huge' color='black'>
            Login
          </Button>
            )}
      </Container>
    </Segment>
  )
}

export default observer(Homepage)
