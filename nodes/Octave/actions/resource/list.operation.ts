import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Resource Type',
		name: 'resourceType',
		type: 'options',
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Text', value: 'text' },
			{ name: 'URL', value: 'url' },
			{ name: 'Google Drive', value: 'google_drive' },
		],
		default: '',
		description: 'Filter by resource type',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Failed', value: 'failed' },
			{ name: 'Indexed', value: 'indexed' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Uploading', value: 'uploading' },
		],
		default: '',
		description: 'Filter by processing status',
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		description: 'Search query',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Max number of results to return',
		typeOptions: { minValue: 1 },
		default: 50,
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
	},
];

const displayOptions = {
	show: {
		resource: ['resource'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const resourceType = this.getNodeParameter('resourceType', itemIndex) as string;
	const status = this.getNodeParameter('status', itemIndex) as string;
	const search = this.getNodeParameter('search', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (resourceType) qs.resourceType = resourceType;
	if (status) qs.status = status;
	if (search) qs.search = search;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/resource/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
