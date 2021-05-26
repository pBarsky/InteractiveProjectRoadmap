import { date, object, ref, SchemaOf, string } from 'yup';
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
    startsOn: date().required(validationErrorMessages.startsOn.requiredMilestone),
    endsOn: date()
      .notRequired()
      .min(ref('startsOn'), validationErrorMessages.endsOn.failedTime)
  })
  .defined();
