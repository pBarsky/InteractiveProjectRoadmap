import { observer } from 'mobx-react-lite'
import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'

const Dashboard = () => {
  const { userStore } = useStore()
  const { user } = userStore
  return (
    <Segment
      textAlign='center'
      vertical
      style={{
        display: ' flex',
        alignItems: 'center'
      }}>
      <Container>
        <Header as='h2'>Hello,</Header>
        <Header as='h1' style={{ fontSize: '3em', marginTop: 0 }}>
          {user?.displayName}
        </Header>
      </Container>
    </Segment>
  )
}

export default observer(Dashboard)
