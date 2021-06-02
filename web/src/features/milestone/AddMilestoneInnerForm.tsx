import { FormikProps } from 'formik';
import React from 'react';
import Field from '../../app/common/inputs/Field';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues } from '../../app/models/milestone';
import styles from './AddMilestone.module.scss';

const AddMilestoneInnerForm = ({
  isSubmitting,
  handleSubmit
}: FormikProps<MilestoneFormValues>) => {
  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <Field
          label={defaultDict.forms.inputs.name.labelText}
          name={defaultDict.forms.inputs.name.name}
          id={`${defaultDict.forms.inputs.name.name}AddMilestone`}
          required
        />
        <Field
          label={defaultDict.forms.inputs.description.labelText}
          name={defaultDict.forms.inputs.description.name}
          id={`${defaultDict.forms.inputs.description.name}AddMilestone`}
        />
        <Field
          label={defaultDict.forms.inputs.endsOn.labelText}
          name={defaultDict.forms.inputs.endsOn.name}
          id={`${defaultDict.forms.inputs.endsOn.name}AddMilestone`}
          required
          type='date'
        />
        <div className={styles.buttonDiv}>
          <button className={styles.submitButton} disabled={isSubmitting} type='submit'>
            {defaultDict.forms.buttons.add.text}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMilestoneInnerForm;
