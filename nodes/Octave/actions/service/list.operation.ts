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
		displayName: 'Service OId',
		name: 'serviceOId',
		type: 'string',
		default: '',
		description: 'Filter list by a specific Service OId',
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
		resource: ['service'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const text = this.getNodeParameter('text', itemIndex) as string;
	const serviceOId = this.getNodeParameter('serviceOId', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (text) qs.text = text;
	if (serviceOId) qs.serviceOId = serviceOId;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/service/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
