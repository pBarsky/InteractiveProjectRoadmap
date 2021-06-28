import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from '../../../../App';
import defaultDict from '../../../../app/dictionaries/defaultDict';
import FileUploadField from '../FileUploadField';
import Form from '../Form';

describe('<FileUploadField/>', () => {
	it('Should render FileUploadField', async () => {
		const onSubmit = jest.fn();
		const setFieldValue = () => {};
		const exampleLabelText = 'testLabel';
		const exampleNameText = 'testFieldName';
		const { getByLabelText } = render(
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
								id={`uploadimage${defaultDict.forms.inputs.upload.name}`}
							/>
						</Form>
					)}
				/>
			</Router>
		);

		await waitFor(() => {
			expect(getByLabelText(exampleLabelText)).toBeInTheDocument();
		});
	});
});
