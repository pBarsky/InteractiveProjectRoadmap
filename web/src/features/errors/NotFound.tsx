import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'

const NotFound = () => {
  return (
    <Segment
      textAlign='center'
      vertical
      style={{
        display: ' flex',
        alignItems: 'center'
      }}>
      <Container>
        <Header as='h1'>We could not find what you were looking for :(</Header>
      </Container>
    </Segment>
  )
}

export default NotFound
