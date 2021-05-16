import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'

interface Props {
  message?: string
}
const NotFound = ({ message }: Props) => {
  return (
    <Segment
      textAlign='center'
      vertical
      style={{
        display: ' flex',
        alignItems: 'center'
      }}>
      <Container>
        <Header as='h1'>
          {message ?? 'Sorry. We could not find what you were looking for 😟.'}
        </Header>
      </Container>
    </Segment>
  )
}

export default NotFound
