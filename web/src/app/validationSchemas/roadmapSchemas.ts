import { date, object, ref, SchemaOf, string } from 'yup';
import { RoadmapFormValues } from '../models/roadmap';
import validationErrorMessages from './customErrorMessages';

export const roadmapFormValuesSchema: SchemaOf<RoadmapFormValues> = object()
  .shape({
    name: string()
      .required(validationErrorMessages.name.required)
      .max(255, validationErrorMessages.name.max(255)),
    description: string()
      .notRequired()
      .max(2048, validationErrorMessages.description.max(2048)),
    startsOn: date().required(validationErrorMessages.startsOn.required),
    endsOn: date()
      .notRequired()
      .min(ref('startsOn'), validationErrorMessages.endsOn.failedTime)
  })
  .defined();
