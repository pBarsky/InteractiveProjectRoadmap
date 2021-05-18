import { object, SchemaOf, string, date } from 'yup';
import { Roadmap } from '../models/roadmap';

export const roadmapFormValuesSchema: SchemaOf<Roadmap> = object()
  .shape({
    name: string().required().max(255),
    description: string().notRequired().max(2048),
    startsOn: date().required(),
    endsOn: date().notRequired()
  })
  .defined();
