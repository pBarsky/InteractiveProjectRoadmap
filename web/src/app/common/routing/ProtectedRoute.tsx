import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useStore } from '../../stores/store'

const ProtectedRoute = (props: RouteProps) => {
  const {
    userStore: { isLoggedIn }
  } = useStore()

  if (isLoggedIn) {
    return <Route {...props} />
  }
  return <Redirect to='/login' />
}

export default ProtectedRoute
