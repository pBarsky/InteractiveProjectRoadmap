import { faCalendar, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormikProps } from 'formik';
import React from 'react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { RoadmapFormValues } from '../../app/models/roadmap';
import BackButton from '../common/buttons/BackButton';
import Button from '../common/buttons/Button';
import Field from '../common/inputs/Field';
import Form from '../common/inputs/Form';
import routes from '../common/routing/routes';
import styles from './AddRoadmapInnerForm.module.scss';

const AddRoadmapInnerForm = ({
	isValid,
	errors,
	isSubmitting,
	submitForm
}: FormikProps<RoadmapFormValues>) => {
	return (
		<Form onSubmit={submitForm}>
			<Field
				label={defaultDict.forms.inputs.name.labelText}
				id={defaultDict.forms.inputs.name.name}
				name={defaultDict.forms.inputs.name.name}
				placeholder={defaultDict.forms.inputs.name.placeholder}
				required
				icon={faEdit}
			/>
			<Field
				label={defaultDict.forms.inputs.description.labelText}
				id={defaultDict.forms.inputs.description.name}
				name={defaultDict.forms.inputs.description.name}
				placeholder={defaultDict.forms.inputs.description.placeholder}
				icon={faEdit}
			/>

			<Field
				label={defaultDict.forms.inputs.startsOn.labelText}
				id={defaultDict.forms.inputs.startsOn.name}
				name={defaultDict.forms.inputs.startsOn.name}
				type='date'
				placeholder={defaultDict.forms.inputs.startsOn.placeholder}
				required
				icon={faCalendar}
			/>
			<Field
				label={defaultDict.forms.inputs.endsOn.labelText}
				id={defaultDict.forms.inputs.endsOn.name}
				name={defaultDict.forms.inputs.endsOn.name}
				placeholder={defaultDict.forms.inputs.endsOn.placeholder}
				type='date'
				icon={faCalendar}
			/>
			{errors.commonFormError && (
				<div className={styles.errorMessage}>{errors.commonFormError}</div>
			)}
			<div className={styles.buttonsContainer}>
				<BackButton backUrl={routes.user.dashboard} />
				<Button disabled={!isValid || isSubmitting} type='submit'>
					{defaultDict.forms.buttons.add.text}
				</Button>
			</div>
		</Form>
	);
};

export default AddRoadmapInnerForm;
