import { createBrowserHistory } from 'history'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Login from '../../features/auth/Login'
import Register from '../../features/auth/Register'
import Homepage from '../../features/home/Homepage'
import UserDashboard from '../../features/users/UserDashboard'
import ProtectedRoute from '../common/routing/ProtectedRoute'
import { StoreProvider, useStore } from '../stores/store'
import './App.css'
import LoadingComponent from './LoadingComponent'
import Navbar from './navbar/Navbar'

export const browserHistory = createBrowserHistory()

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
    <StoreProvider>
      <Router history={browserHistory}>
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
      </Router>
    </StoreProvider>
  )
}

export default observer(App)
