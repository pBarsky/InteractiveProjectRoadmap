import { createContext, useContext } from 'react';
import DefaultAuthStore, { AuthStore } from './authStore';
import DefaultCommonStore, { CommonStore } from './commonStore';
import DefaultRoadmapStore, { RoadmapStore } from './roadmapStore';
import DefaultMilestoneStore, { MilestoneStore } from './milestoneStore';

export interface Store {
	authStore: AuthStore;
	roadmapStore: RoadmapStore;
	milestoneStore: MilestoneStore;
	commonStore: CommonStore;
}

export const store: Store = {
	authStore: DefaultAuthStore,
	commonStore: DefaultCommonStore,
	roadmapStore: DefaultRoadmapStore,
	milestoneStore: DefaultMilestoneStore
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
		<StoreContext.Provider value={props.store ?? store}>{props.children}</StoreContext.Provider>
	);
};

export default Store;
