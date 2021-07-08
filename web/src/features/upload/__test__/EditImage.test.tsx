import { render, waitFor } from '@testing-library/react';
import React from 'react';
import defaultDict from '../../../app/dictionaries/defaultDict';
import { Roadmap } from '../../../app/models/roadmap';
import { store } from '../../../app/stores/store';
import { WithStoresAndRouter } from '../../../setupTests';
import EditImage from '../EditImage';

describe('<EditImage/>', () => {
	it('Should render form with add button when background image is not present', async () => {
		const testRoadmap: Roadmap = {
			description: 'Lorem ipsum piwo piwo piwo',
			name: 'DASDASD',
			id: 1,
			endsOn: null,
			startsOn: new Date('1999-02-15T22:22')
		};

		store.roadmapStore.selectedRoadmap = testRoadmap;

		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<EditImage />
			</WithStoresAndRouter>
		);

		await waitFor(() => {
			expect(getByText(defaultDict.forms.buttons.addImage.text)).toBeInTheDocument();
		});
	});

	it('Should render form with edit button and an image when background image is present', async () => {
		const testRoadmap: Roadmap = {
			description: 'Lorem ipsum piwo piwo piwo',
			name: 'DASDASD',
			id: 1,
			imageUrl: 'http://someUrl.url',
			endsOn: null,
			startsOn: new Date('1999-02-15T22:22')
		};

		store.roadmapStore.selectedRoadmap = testRoadmap;

		const { getByText } = render(
			<WithStoresAndRouter store={store}>
				<EditImage />
			</WithStoresAndRouter>
		);

		await waitFor(() => {
			expect(getByText(defaultDict.forms.buttons.editImage.text)).toBeInTheDocument();
		});
	});
});
