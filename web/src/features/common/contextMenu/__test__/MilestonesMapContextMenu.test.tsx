import { render } from '@testing-library/react';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import { DefaultRoadmap } from '../../../../app/models/roadmap';
import { store } from '../../../../app/stores/store';
import { WithStoresAndRouter } from '../../../../setupTests';
import MilestonesMapContextMenu from '../MilestonesMapContextMenu';

describe('<MilestonesMapContextMenu />', () => {
	it('Should render all options', () => {
		const options = Object.values(defaultDict.pages.flowPane.contextMenu);
		store.roadmapStore.selectedRoadmap = new DefaultRoadmap();
		store.commonStore.isContextMenuVisible = true;

		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<MilestonesMapContextMenu />
			</WithStoresAndRouter>
		);

		options.forEach((opt) => {
			expect(getByText(opt)).toBeInTheDocument();
		});
	});
});
