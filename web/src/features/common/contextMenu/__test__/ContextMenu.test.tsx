import { render } from '@testing-library/react';
import React from 'react';
import { store } from '../../../../app/stores/store';
import { WithStoresAndRouter } from '../../../../setupTests';
import ContextMenu from '../ContextMenu';

describe('<ContextMenu />', () => {
	it('Doesnt render when visibility flag in store is false', () => {
		const testId = 'test-id';

		const { getByTestId } = render(
			<WithStoresAndRouter>
				<div data-testid={testId}>
					<ContextMenu></ContextMenu>
				</div>
			</WithStoresAndRouter>
		);

		expect(getByTestId(testId)).toBeEmptyDOMElement();
	});

	it('Renders wrapper when visibility flag is true', () => {
		store.commonStore.isContextMenuVisible = true;
		const testId = 'test-id';

		const { getByTestId } = render(
			<WithStoresAndRouter>
				<div data-testid={testId}>
					<ContextMenu></ContextMenu>
				</div>
			</WithStoresAndRouter>
		);

		expect(getByTestId(testId)).not.toBeEmptyDOMElement();
	});

	it('Renders wrapper with provided children when visibility flag is true', () => {
		store.commonStore.isContextMenuVisible = true;
		const text = 'Some Text';
		const child = <div>{text}</div>;

		const { getByText } = render(
			<WithStoresAndRouter>
				<ContextMenu>{child}</ContextMenu>
			</WithStoresAndRouter>
		);
		expect(getByText(text)).toBeInTheDocument();
	});
});
