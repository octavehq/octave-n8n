import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Text Search',
		name: 'text',
		type: 'string',
		default: '',
		description: 'Text search query',
	},
	{
		displayName: 'Solution OIds',
		name: 'solutionOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of solution OIds',
	},
	{
		displayName: 'Active Only',
		name: 'activeOnly',
		type: 'boolean',
		default: false,
		description: 'Whether to return only active solutions',
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
		resource: ['solution'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const text = this.getNodeParameter('text', itemIndex) as string;
	const solutionOIds = this.getNodeParameter('solutionOIds', itemIndex) as string;
	const activeOnly = this.getNodeParameter('activeOnly', itemIndex) as boolean;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (text) qs.text = text;
	if (solutionOIds) qs.solutionOIds = solutionOIds.split(',').map(id => id.trim());
	if (activeOnly) qs.activeOnly = activeOnly;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/solution/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
