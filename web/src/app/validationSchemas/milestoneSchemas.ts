import { date, number, object, SchemaOf, string } from 'yup';
import { Milestone, MilestoneFormValues } from '../models/milestone';
import validationErrorMessages from './customErrorMessages';

export const milestoneFormValuesSchema: SchemaOf<MilestoneFormValues> = object()
	.shape({
		name: string()
			.required(validationErrorMessages.name.requiredMilestone)
			.max(255, validationErrorMessages.name.max(255)),
		description: string()
			.notRequired()
			.max(2048, validationErrorMessages.description.max(2048)),
		endsOn: date().required(validationErrorMessages.endsOn.requiredMilestone)
	})
	.defined();

export const milestoneEditFormValuesSchema: SchemaOf<Milestone> = object()
	.shape({
		id: number().required(),
		name: string()
			.required(validationErrorMessages.name.requiredMilestone)
			.max(255, validationErrorMessages.name.max(255)),
		description: string()
			.notRequired()
			.max(2048, validationErrorMessages.description.max(2048)),
		endsOn: date().required(validationErrorMessages.endsOn.requiredMilestone),
		parentProjectId: number().required(),
		status: number().required()
	})
	.defined();
