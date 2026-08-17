import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Statuses',
		name: 'statuses',
		type: 'string',
		default: '',
		description: 'Comma-separated list of statuses to filter by',
	},
	{
		displayName: 'Change Types',
		name: 'changeTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of change types to filter by (add, refine)',
	},
	{
		displayName: 'Target Entity Types',
		name: 'targetEntityTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of target entity types to filter by (e.g. persona, product)',
	},
	{
		displayName: 'Days Back',
		name: 'daysBack',
		type: 'number',
		default: 0,
		description: 'Only include suggestions from the last N days (0 = no filter)',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		description: 'Filter by start date (ISO format)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		description: 'Filter by end date (ISO format)',
	},
	{
		displayName: 'Source Types',
		name: 'sourceTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of source types to filter by',
	},
	{
		displayName: 'Sort Direction',
		name: 'sortDirection',
		type: 'options',
		options: [
			{ name: 'Default', value: '' },
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: '',
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
		resource: ['suggestion'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const qs: any = {};

	for (const field of ['statuses', 'changeTypes', 'targetEntityTypes', 'sourceTypes']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) qs[field] = value.split(',').map(v => v.trim());
	}
	const daysBack = this.getNodeParameter('daysBack', itemIndex) as number;
	if (daysBack) qs.daysBack = daysBack;
	for (const field of ['startDate', 'endDate', 'sortDirection']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) qs[field] = value;
	}
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;
	const offset = this.getNodeParameter('offset', itemIndex) as number;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/suggestion/list', {}, qs);
	return [this.helpers.returnJsonArray(response.suggestions || response.data || [])];
}
