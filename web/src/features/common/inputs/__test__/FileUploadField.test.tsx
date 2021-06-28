import { render, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import FileUploadField from '../FileUploadField';

describe('<FileUploadField/>', () => {
	it('Should render FileUploadField', async () => {
		const onSubmit = jest.fn();
		const setFieldValue = () => {};
		const exampleLabelText = 'testLabel';
		const exampleNameText = 'testFieldName';
		const { getByDisplayValue, getByLabelText } = render(
			<Router history={browserHistory}>
				<Formik
					initialValues={{ [exampleNameText]: exampleNameText }}
					onSubmit={onSubmit}
					component={() => (
						<Form>
							<FileUploadField
								name={exampleNameText}
								setFieldValue={setFieldValue}
								label={exampleLabelText}
							/>
						</Form>
					)}
				/>
			</Router>
		);
		await waitFor(() => {
			expect(getByDisplayValue(exampleNameText)).toBeInTheDocument();
			expect(getByLabelText(exampleLabelText)).toBeInTheDocument();
		});
	});
});
