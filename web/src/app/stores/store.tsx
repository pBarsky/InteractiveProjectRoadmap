import { createContext, useContext } from 'react';
import DefaultAuthStore, { AuthStore } from './authStore';
import DefaultCommonStore, { CommonStore } from './commonStore';

export interface Store {
  authStore: AuthStore;
  commonStore: CommonStore;
}

export const store: Store = {
  authStore: DefaultAuthStore,
  commonStore: DefaultCommonStore
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};

interface StoreProviderProps {
  store?: Store;
  children: JSX.Element | JSX.Element[];
}

export const StoreProvider = (props: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={props.store ?? store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default Store;
