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

export const StoreProvider = ({ children }: any) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)
