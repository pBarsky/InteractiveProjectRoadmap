import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues } from '../../app/models/milestone';
import Button from '../common/buttons/Button';
import Field from '../common/inputs/Field';
import styles from './AddMilestoneInnerForm.module.scss';

const AddMilestoneInnerForm = ({
	isSubmitting,
	handleSubmit
}: FormikProps<MilestoneFormValues>): JSX.Element => {
	return (
		<div className={styles.wrapper}>
			<form onSubmit={handleSubmit}>
				<Field
					label={defaultDict.forms.inputs.name.labelText}
					name={defaultDict.forms.inputs.name.name}
					id={`${defaultDict.forms.inputs.name.name}AddMilestone`}
					required
					className={styles.field}
					errorMessageAbsolutePosition
				/>
				<Field
					label={defaultDict.forms.inputs.endsOn.labelText}
					name={defaultDict.forms.inputs.endsOn.name}
					id={`${defaultDict.forms.inputs.endsOn.name}AddMilestone`}
					required
					type='date'
					className={styles.field}
					errorMessageAbsolutePosition
				/>
				<div className={styles.buttonDiv}>
					<Button className={styles.submitButton} disabled={isSubmitting} type='submit'>
						{defaultDict.forms.buttons.add.text}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddMilestoneInnerForm;
