import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import BackButton from '../../app/common/buttons/BackButton';
import defaultDict from '../../app/dictionaries/defaultDict';
import { MilestoneFormValues } from '../../app/models/milestone';

const AddMilestoneInnerForm = ({
  errors,
  isSubmitting,
  touched,
  handleSubmit
}: FormikProps<MilestoneFormValues>) => {
  return (
    <Form onSubmit={handleSubmit}>
          <label id={defaultDict.forms.inputs.name.label}>
            {defaultDict.forms.inputs.name.labelText}
          </label>
          <Field
            aria-labelledby={defaultDict.forms.inputs.name.label}
            name={defaultDict.forms.inputs.name.name}
            placeholder={defaultDict.forms.inputs.name.placeholder}
            required
          />
          {errors.name && touched.name ? (<div className="error">{errors.name}</div>) : null}

          <label id={defaultDict.forms.inputs.description.label}>
            {defaultDict.forms.inputs.description.labelText}
          </label>
          <Field
            aria-labelledby={defaultDict.forms.inputs.description.label}
            name={defaultDict.forms.inputs.description.name}
            placeholder={defaultDict.forms.inputs.description.placeholder}
            required
          />
          {errors.description && touched.description ? (<div className="error">{errors.description}</div>) : null}

          <label id={defaultDict.forms.inputs.startsOn.label}>
            {defaultDict.forms.inputs.startsOn.labelText}
          </label>
          <Field
            aria-labelledby={defaultDict.forms.inputs.startsOn.label}
            name={defaultDict.forms.inputs.startsOn.name}
            placeholder={defaultDict.forms.inputs.startsOn.placeholder}
            type='datetime-local'
            required
          />
          {errors.startsOn && touched.startsOn ? (<div className="error">{errors.startsOn}</div>) : null}

          <label id={defaultDict.forms.inputs.endsOn.label}>
            {defaultDict.forms.inputs.endsOn.labelText}
          </label>
          <Field
            aria-labelledby={defaultDict.forms.inputs.endsOn.label}
            name={defaultDict.forms.inputs.endsOn.name}
            placeholder={defaultDict.forms.inputs.endsOn.placeholder}
            type='datetime-local'
            required
          />
          {errors.endsOn && touched.endsOn ? (<div className="error">{errors.endsOn}</div>) : null}

          <BackButton />
            <button
              color='black'
              disabled={isSubmitting}
              type='submit'>
              {defaultDict.forms.buttons.add.text}
            </button>
        </Form>
  );
};

export default AddMilestoneInnerForm;
