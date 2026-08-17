import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
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
		displayName: 'Extraction Type',
		name: 'extractionType',
		type: 'string',
		default: '',
		description: 'Filter by extraction type, e.g. CALL_EXTERNAL_OBJECTIONS or RESOURCE_USE_CASES (optional, see API docs for the full list)',
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
		resource: ['finding'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const qs: any = {};
	for (const field of ['startDate', 'endDate', 'extractionType']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) qs[field] = value;
	}
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;
	const offset = this.getNodeParameter('offset', itemIndex) as number;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/finding/list', {}, qs);
	return [this.helpers.returnJsonArray(response.findings || response.data || [])];
}
