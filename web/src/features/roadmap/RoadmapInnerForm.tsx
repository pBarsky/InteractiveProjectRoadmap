import { ErrorMessage, FormikProps } from 'formik';
import { Form, Input } from 'formik-semantic-ui-react';
import React from 'react';
import { Button, Container, FormField, Label } from 'semantic-ui-react';
import defaultDict from '../../app/dictionaries/defaultDict';
import { RoadmapFormValues } from '../../app/models/roadmap';

const RoadmapInnerForm = ({
  isValid,
  errors,
  isSubmitting,
  touched
}: FormikProps<RoadmapFormValues>) => {
  return (
    <Form
      loading={isSubmitting}
      layout='vertical'
      style={{
        width: 'clamp(300px, 50vw, 500px)',
        margin: 'auto',
        border: '1px solid rgba(0,0,0,.05)',
        boxShadow: '0 10px 25px rgba(0,0,0,.05)',
        padding: '20px'
      }}>
      <FormField required>
        <label id={defaultDict.forms.inputs.name.label}>
          {defaultDict.forms.inputs.name.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.name.label}
          name={defaultDict.forms.inputs.name.name}
          placeholder={defaultDict.forms.inputs.name.placeholder}
          required
          icon='edit outline'
          iconPosition='left'
        />
        {touched.name && errors.name && <Label prompt>{errors.name}</Label>}
      </FormField>
      <FormField>
        <label id={defaultDict.forms.inputs.description.label}>
          {defaultDict.forms.inputs.description.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.description.label}
          name={defaultDict.forms.inputs.description.name}
          placeholder={defaultDict.forms.inputs.description.placeholder}
          icon='edit outline'
          iconPosition='left'
        />
        {touched.description && errors.description && <Label prompt>{errors.description}</Label>}
      </FormField>
      <FormField required>
        <label id={defaultDict.forms.inputs.startsOn.label}>
          {defaultDict.forms.inputs.startsOn.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.startsOn.label}
          name={defaultDict.forms.inputs.startsOn.name}
          type='datetime-local'
          placeholder={defaultDict.forms.inputs.startsOn.placeholder}
          required
          icon='calendar alternate outline'
          iconPosition='left'
        />
        {touched.startsOn && errors.startsOn && <Label prompt>{errors.startsOn}</Label>}
      </FormField>
      <FormField>
        <label id={defaultDict.forms.inputs.endsOn.label}>
          {defaultDict.forms.inputs.endsOn.labelText}
        </label>
        <Input
          aria-labelledby={defaultDict.forms.inputs.endsOn.label}
          name={defaultDict.forms.inputs.endsOn.name}
          placeholder={defaultDict.forms.inputs.endsOn.placeholder}
          type='datetime-local'
          icon='calendar alternate outline'
          iconPosition='left'
        />
        {touched.endsOn && errors.endsOn && <Label prompt>{errors.endsOn}</Label>}
      </FormField>
      <ErrorMessage
        name='commonFormError'
        render={() => (
          <Label
            style={{ marginBottom: 10 }}
            basic
            color='red'
            content={errors.commonFormError}
          />
        )}
      />
      <Container>
        <Button
          color='black'
          disabled={!isValid}
          loading={isSubmitting}
          type='submit'>
          {defaultDict.forms.buttons.add.text}
        </Button>
      </Container>
    </Form>
  );
};

export default RoadmapInnerForm;
