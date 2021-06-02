import { render, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import Field from '../Field';

describe('<Field/>', () => {
	it('Should render Field', async () => {
		const onSubmit = jest.fn();
		const labelText = 'testLabel';
		const nameText = 'testFieldName';
		const testId = 'testid';
		const { getByDisplayValue, getByLabelText } = render(
			<Router history={browserHistory}>
				<Formik
					initialValues={{ [nameText]: nameText }}
					onSubmit={onSubmit}
					component={() => (
						<Form>
							<Field id={testId} label={labelText} name={nameText} />
						</Form>
					)}
				/>
			</Router>
		);
		await waitFor(() => {
			expect(getByDisplayValue(nameText)).toBeInTheDocument();
			expect(getByLabelText(labelText)).toBeInTheDocument();
		});
	});
});
