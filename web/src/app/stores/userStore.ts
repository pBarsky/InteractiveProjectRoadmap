import { makeAutoObservable } from 'mobx'
import { browserHistory } from '../../app/layout/App'
import agent from '../api/agent'
import { User, UserFormValues } from '../models/user'
import { store } from './store'

export default class UserStore {
  private _user: User | null = null

  private _refreshTokenTimeout: any

  constructor () {
    makeAutoObservable(this)
  }

  public get refreshTokenTimeout (): any {
    return this._refreshTokenTimeout
  }

  public set refreshTokenTimeout (value: any) {
    this._refreshTokenTimeout = value
  }

  public get user (): User | null {
    return this._user
  }

  public set user (value: User | null) {
    this._user = value
  }

  get isLoggedIn () {
    return !!this.user
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds)
      store.commonStore.setToken(user.token)
      this.setUser(user)
      this.startRefreshTokenTimer(user)
      browserHistory.push('/dashboard')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds)
      store.commonStore.setToken(user.token)
      this.setUser(user)
      this.startRefreshTokenTimer(user)
      browserHistory.push('/dashboard')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  logout = () => {
    store.commonStore.setToken(null)
    window.localStorage.removeItem('jwt')
    this.setUser(null)
    browserHistory.push('/')
  }

  setUser = (user: User | null) => {
    this.user = user
  }

  getUser = async () => {
    try {
      const user = await agent.Account.current()
      this.setUser(user)
      store.commonStore.setToken(user.token)
      this.startRefreshTokenTimer(user)
    } catch (error) {
      console.log(error)
    }
  }

  refreshToken = async () => {
    this.stopRefreshTokenTimer()
    try {
      const user = await agent.Account.refreshToken()
      this.setUser(user)
      store.commonStore.setToken(user.token)
      this.startRefreshTokenTimer(user)
    } catch (error) {
      console.log(error)
    }
  }

  private startRefreshTokenTimer = (user: User) => {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1]))
    const expires = new Date(jwtToken.exp * 1000)
    const timeout = expires.getTime() - Date.now() - 60 * 1000
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
  }

  private stopRefreshTokenTimer = () => {
    clearTimeout(this.refreshTokenTimeout)
  }
}
