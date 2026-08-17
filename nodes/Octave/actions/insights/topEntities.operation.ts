import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Period Type',
		name: 'periodType',
		type: 'options',
		options: [
			{ name: 'Month', value: 'month' },
			{ name: 'Quarter', value: 'quarter' },
			{ name: 'Week', value: 'week' },
		],
		default: 'month',
		description: 'The period granularity',
	},
	{
		displayName: 'Period Start',
		name: 'periodStart',
		type: 'string',
		required: true,
		default: '',
		description: 'Start of the period (ISO date, e.g. 2026-08-01)',
	},
	{
		displayName: 'Entity Types',
		name: 'entityTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of entity types to include (optional)',
	},
	{
		displayName: 'Sort',
		name: 'sort',
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
];

const displayOptions = {
	show: {
		resource: ['insights'],
		operation: ['topEntities'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const periodType = this.getNodeParameter('periodType', itemIndex) as string;
	const periodStart = this.getNodeParameter('periodStart', itemIndex) as string;
	if (!periodStart) {
		throw new NodeOperationError(this.getNode(), 'Period Start is required.', { itemIndex });
	}

	const qs: any = { periodType, periodStart };
	const entityTypes = this.getNodeParameter('entityTypes', itemIndex) as string;
	if (entityTypes) qs.entityTypes = entityTypes.split(',').map(t => t.trim());
	const sort = this.getNodeParameter('sort', itemIndex) as string;
	if (sort) qs.sort = sort;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/insights/top-entities', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
