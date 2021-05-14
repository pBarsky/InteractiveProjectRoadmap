import { createContext, useContext } from 'react'
import CommonStore from './commonStore'
import UserStore from './userStore'

export interface Store {
  userStore: UserStore
  commonStore: CommonStore
}

export const store: Store = {
  userStore: new UserStore(),
  commonStore: new CommonStore()
}

export const StoreContext = createContext(store)

export const useStore = () => {
  return useContext(StoreContext)
}

interface StoreProviderProps {
  store?: Store
  children: JSX.Element | JSX.Element[]
}

export const StoreProvider = (props: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={props.store ?? store}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default Store
