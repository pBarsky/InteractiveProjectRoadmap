import { object, SchemaOf, string, date } from 'yup';
import { Roadmap } from '../models/roadmap';
import validationErrorMessages from './customErrorMessages';

export const roadmapFormValuesSchema: SchemaOf<Roadmap> = object()
  .shape({
    name: string().required(validationErrorMessages.name.required).max(255),
    description: string().notRequired().max(2048),
    startsOn: date().required(validationErrorMessages.startsOn.required),
    endsOn: date().notRequired()
  })
  .defined();
