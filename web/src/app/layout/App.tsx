import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Login from '../../features/auth/Login'
import Register from '../../features/auth/Register'
import Homepage from '../../features/home/Homepage'
import UserDashboard from '../../features/users/UserDashboard'
import ProtectedRoute from '../common/routing/ProtectedRoute'
import { useStore } from '../stores/store'
import './App.css'
import LoadingComponent from './LoadingComponent'
import Navbar from './navbar/Navbar'

function App () {
  const { commonStore, userStore } = useStore()

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) {
    return <LoadingComponent content='Loading app...' />
  }
  return (
    <>
      <Navbar />
      <Container
        style={{
          height: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        as='main'>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <ProtectedRoute path='/dashboard' component={UserDashboard} />
          <Route exact path='/' component={Homepage} />
          <Redirect to='/' />
        </Switch>
      </Container>
    </>
  )
}

export default observer(App)
