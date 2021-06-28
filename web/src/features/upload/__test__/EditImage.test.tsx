import { store } from "../../../app/stores/store";

describe('<EditImage/>', () => {
	it('Should render form with button', async () => {
        store.roadmapStore.selectedRoadmap  = 
        
		const { getByRole } = render(
            <StoreProvider>
			<Router history={browserHistory}>
				<EditImage />
			</Router>
            </StoreProvider>
            );

		await waitFor(() => {
			expect(
				getByRole('button', { name:  })
			).toBeInTheDocument();
			expect(getByRole('img')).toBeInTheDocument();
		});
	});
});
