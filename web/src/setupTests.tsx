// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React, { PropsWithChildren } from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from './App';
import Store, { store as defaultStore, StoreProvider } from './app/stores/store';

beforeEach(() => {
	window.ResizeObserver = jest.fn().mockImplementation(() => ({
		disconnect: jest.fn(),
		observe: jest.fn(),
		unobserve: jest.fn()
	}));
});

export const WithStoresAndRouter = ({
	children,
	store
}: PropsWithChildren<{ store?: Store }>): JSX.Element => {
	return (
		<StoreProvider store={store ?? defaultStore}>
			<Router history={browserHistory}>{children}</Router>
		</StoreProvider>
	);
};
