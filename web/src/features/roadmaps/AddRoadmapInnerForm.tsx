import { ErrorMessage, Field as FormikField, Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { Button, Container, Form, Input, Label } from 'semantic-ui-react';
import BackButton from '../../app/common/buttons/BackButton';
import defaultDict from '../../app/dictionaries/defaultDict';
import { RoadmapFormValues } from '../../app/models/roadmap';

const AddRoadmapInnerForm = ({
  isValid,
  errors,
  isSubmitting,
  touched,
  submitForm
}: FormikProps<RoadmapFormValues>) => {
  return (
    <Form
      as={FormikForm}
      loading={isSubmitting}
      layout='vertical'
      style={{
        width: 'clamp(300px, 50vw, 500px)',
        margin: 'auto',
        border: '1px solid rgba(0,0,0,.05)',
        boxShadow: '0 10px 25px rgba(0,0,0,.05)',
        padding: '20px'
      }}
      onSubmit={submitForm}
    >
      <Form.Field required>
        <label htmlFor={defaultDict.forms.inputs.name.name}>
          {defaultDict.forms.inputs.name.labelText}
        </label>
        <FormikField
          as={Input}
          id={defaultDict.forms.inputs.name.name}
          name={defaultDict.forms.inputs.name.name}
          placeholder={defaultDict.forms.inputs.name.placeholder}
          required
          icon='edit outline'
          iconPosition='left'
        />
        {touched.name && errors.name && <Label prompt>{errors.name}</Label>}
      </Form.Field>
      <Form.Field>
        <label htmlFor={defaultDict.forms.inputs.description.name}>
          {defaultDict.forms.inputs.description.labelText}
        </label>
        <FormikField
          as={Input}
          id={defaultDict.forms.inputs.description.name}
          name={defaultDict.forms.inputs.description.name}
          placeholder={defaultDict.forms.inputs.description.placeholder}
          icon='edit outline'
          iconPosition='left'
        />
        {touched.description && errors.description && <Label prompt>{errors.description}</Label>}
      </Form.Field>
      <Form.Field required>
        <label htmlFor={defaultDict.forms.inputs.startsOn.name}>
          {defaultDict.forms.inputs.startsOn.labelText}
        </label>
        <FormikField
          as={Input}
          id={defaultDict.forms.inputs.startsOn.name}
          name={defaultDict.forms.inputs.startsOn.name}
          type='datetime-local'
          placeholder={defaultDict.forms.inputs.startsOn.placeholder}
          required
          icon='calendar alternate outline'
          iconPosition='left'
        />
        {touched.startsOn && errors.startsOn && <Label prompt>{errors.startsOn}</Label>}
      </Form.Field>
      <Form.Field>
        <label htmlFor={defaultDict.forms.inputs.endsOn.name}>
          {defaultDict.forms.inputs.endsOn.labelText}
        </label>
        <FormikField
          as={Input}
          id={defaultDict.forms.inputs.endsOn.name}
          name={defaultDict.forms.inputs.endsOn.name}
          placeholder={defaultDict.forms.inputs.endsOn.placeholder}
          type='datetime-local'
          icon='calendar alternate outline'
          iconPosition='left'
        />
        {touched.endsOn && errors.endsOn && <Label prompt>{errors.endsOn}</Label>}
      </Form.Field>
      <ErrorMessage
        name='commonFormError'
        render={() => (
          <Label style={{ marginBottom: 10 }} basic color='red' content={errors.commonFormError} />
        )}
      />
      <Container>
        <BackButton />
        <Button
          color='black'
          disabled={!isValid}
          loading={isSubmitting}
          floated='right'
          type='submit'
        >
          {defaultDict.forms.buttons.add.text}
        </Button>
      </Container>
    </Form>
  );
};

export default AddRoadmapInnerForm;
