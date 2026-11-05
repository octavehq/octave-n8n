import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Entity Types',
		name: 'entityTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of entity types to filter by (optional)',
	},
	{
		displayName: 'Entity OIds',
		name: 'entityOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of entity OIds to filter by (optional)',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		description: 'Start date (ISO format, optional)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		description: 'End date (ISO format, optional)',
	},
	{
		displayName: 'Author OId',
		name: 'authorOId',
		type: 'string',
		default: '',
		description: 'Filter by author OId (optional)',
	},
	{
		displayName: 'Include Restored',
		name: 'includeRestored',
		type: 'boolean',
		default: false,
		description: 'Whether to include restored revisions',
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
		resource: ['revision'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const qs: any = {};

	const entityTypes = this.getNodeParameter('entityTypes', itemIndex) as string;
	if (entityTypes) qs.entityTypes = entityTypes.split(',').map(t => t.trim());
	const entityOIds = this.getNodeParameter('entityOIds', itemIndex) as string;
	if (entityOIds) qs.entityOIds = entityOIds.split(',').map(id => id.trim());
	for (const field of ['startDate', 'endDate', 'authorOId']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) qs[field] = value;
	}
	if (this.getNodeParameter('includeRestored', itemIndex) as boolean) qs.includeRestored = true;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;
	const offset = this.getNodeParameter('offset', itemIndex) as number;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/revision/list', {}, qs);
	return [this.helpers.returnJsonArray(response.revisions || response.data || [])];
}
