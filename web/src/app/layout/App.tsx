import { createBrowserHistory } from 'history'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Login from '../../features/auth/Login'
import Register from '../../features/auth/Register'
import Homepage from '../../features/home/Homepage'
import Dashboard from '../../features/users/Dashboard'
import ProtectedRoute from '../common/routing/ProtectedRoute'
import routes from '../common/routing/routes'
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
            <Route path={routes.auth.login} component={Login} />
            <Route path={routes.auth.register} component={Register} />
            <ProtectedRoute
              path={routes.user.dashboard}
              component={Dashboard}
            />
            <Route exact path={routes.common.home} component={Homepage} />
            <Redirect to={routes.common.notFound} />
          </Switch>
        </Container>
      </Router>
    </StoreProvider>
  )
}

export default observer(App)
