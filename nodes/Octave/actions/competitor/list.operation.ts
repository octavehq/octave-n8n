import {
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';

export const exportedProperties: INodeProperties[] = [
	{
		displayName: 'Competitor OIds',
		name: 'oIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of competitor OIds to filter by',
		displayOptions: {
			show: {
				resource: ['competitor'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Product OId',
		name: 'productOId',
		type: 'string',
		default: '',
		description: 'Filter by product OId',
		displayOptions: {
			show: {
				resource: ['competitor'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Text Search Query',
		name: 'textSearchQuery',
		type: 'string',
		default: '',
		description: 'Text search query to filter competitors',
		displayOptions: {
			show: {
				resource: ['competitor'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['competitor'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of results to skip',
		displayOptions: {
			show: {
				resource: ['competitor'],
				operation: ['list'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oIds = this.getNodeParameter('oIds', itemIndex) as string;
	const productOId = this.getNodeParameter('productOId', itemIndex) as string;
	const textSearchQuery = this.getNodeParameter('textSearchQuery', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};

	if (oIds) {
		qs.oIds = oIds.split(',').map((id: string) => id.trim());
	}
	if (productOId) {
		qs.productOId = productOId;
	}
	if (textSearchQuery) {
		qs.textSearchQuery = textSearchQuery;
	}
	if (limit) {
		qs.limit = limit;
	}
	if (offset) {
		qs.offset = offset;
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'octaveApi', {
		method: 'GET',
		url: `/api/v2/competitor/list`,
		qs,
	});

	return [this.helpers.returnJsonArray(response.data || [])];
}