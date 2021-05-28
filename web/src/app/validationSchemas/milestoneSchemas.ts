import { date, object, SchemaOf, string } from 'yup';
import { MilestoneFormValues } from '../models/milestone';
import validationErrorMessages from './customErrorMessages';

export const milestoneFormValuesSchema: SchemaOf<MilestoneFormValues> = object()
  .shape({
    name: string()
      .required(validationErrorMessages.name.requiredMilestone)
      .max(255, validationErrorMessages.name.max(255)),
    description: string()
      .notRequired()
      .max(2048, validationErrorMessages.description.max(2048)),
    endsOn: date()
      .required(validationErrorMessages.endsOn.requiredMilestone)
  })
  .defined();
