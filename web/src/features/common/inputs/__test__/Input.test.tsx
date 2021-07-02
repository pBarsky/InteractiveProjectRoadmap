import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import Form from '../Form';
import Input from '../Input';

describe('<Input/>', () => {
	it('Should render Input', async () => {
		const onSubmit = jest.fn();
		const nameText = 'testInputName';
		const { getByDisplayValue } = render(
			<Router history={browserHistory}>
				<Formik
					initialValues={{ [nameText]: nameText }}
					onSubmit={onSubmit}
					component={(): JSX.Element => (
						<Form>
							<Input name={nameText} />
						</Form>
					)}
				/>
			</Router>
		);
		await waitFor(() => {
			expect(getByDisplayValue(nameText)).toBeInTheDocument();
		});
	});
});
