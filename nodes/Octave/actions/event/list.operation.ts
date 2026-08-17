import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		required: true,
		default: '',
		description: 'Start date (ISO format)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		description: 'End date (ISO format, optional)',
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of event types to filter by (optional)',
	},
	{
		displayName: 'Event Categories',
		name: 'eventCategories',
		type: 'string',
		default: '',
		description: 'Comma-separated list of event categories to filter by (optional)',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of results to skip',
	},
];

const displayOptions = {
	show: {
		resource: ['event'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const startDate = this.getNodeParameter('startDate', itemIndex) as string;
	if (!startDate) {
		throw new NodeOperationError(this.getNode(), 'Start Date is required.', { itemIndex });
	}

	const qs: any = { startDate };
	const endDate = this.getNodeParameter('endDate', itemIndex) as string;
	if (endDate) qs.endDate = endDate;
	const eventTypes = this.getNodeParameter('eventTypes', itemIndex) as string;
	if (eventTypes) qs.eventTypes = eventTypes.split(',').map(t => t.trim());
	const eventCategories = this.getNodeParameter('eventCategories', itemIndex) as string;
	if (eventCategories) qs.eventCategories = eventCategories.split(',').map(c => c.trim());
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;
	const offset = this.getNodeParameter('offset', itemIndex) as number;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/event/list', {}, qs);
	return [this.helpers.returnJsonArray(response.events || response.data || [])];
}
