import { makeAutoObservable } from 'mobx'

export default class CommonStore {
  token: string | null = window.localStorage.getItem('jwt')
  appLoaded = false

  constructor () {
    makeAutoObservable(this)
  }

  setToken = (token: string | null) => {
    this.token = token
    if (token) {
      window.localStorage.setItem('jwt', token)
    } else {
      window.localStorage.removeItem('jwt')
    }
  }

  setAppLoaded = () => {
    this.appLoaded = true
  }
}
