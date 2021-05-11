import { makeAutoObservable, reaction } from 'mobx'

export default class CommonStore {
  token: string | null = window.localStorage.getItem('jwt')
  selectedMenuKey: string | undefined
  appLoaded = false

  constructor () {
    makeAutoObservable(this)
    reaction(
      () => this.token,
      (token: string | null) => {
        if (token) {
          window.localStorage.setItem('jwt', token)
        } else {
          window.localStorage.removeItem('jwt')
        }
      }
    )
  }

  setToken = (token: string | null) => {
    this.token = token
  }

  setAppLoaded = () => {
    this.appLoaded = true
  }

  setSelectedMenuKey = (key: string | undefined) => {
    this.selectedMenuKey = key
  }
}
