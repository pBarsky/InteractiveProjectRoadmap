import { createContext, useContext } from 'react';
import DefaultAuthStore, { AuthStore } from './authStore';
import DefaultCommonStore, { CommonStore } from './commonStore';
import DefaultFlowStore, { FlowStore } from './flowStore';
import DefaultMilestoneStore, { MilestoneStore } from './milestoneStore';
import DefaultRoadmapStore, { RoadmapStore } from './roadmapStore';

export interface Store {
	authStore: AuthStore;
	roadmapStore: RoadmapStore;
	milestoneStore: MilestoneStore;
	commonStore: CommonStore;
	flowStore: FlowStore;
}

export const store: Store = {
	authStore: DefaultAuthStore,
	commonStore: DefaultCommonStore,
	roadmapStore: DefaultRoadmapStore,
	milestoneStore: DefaultMilestoneStore,
	flowStore: DefaultFlowStore
};

export const StoreContext = createContext(store);

export const useStore = (): Store => {
	return useContext(StoreContext);
};

interface StoreProviderProps {
	store?: Store;
	children: JSX.Element | JSX.Element[];
}

export const StoreProvider = (props: StoreProviderProps): JSX.Element => {
	return (
		<StoreContext.Provider value={props.store ?? store}>{props.children}</StoreContext.Provider>
	);
};

export default Store;
