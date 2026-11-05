import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Core Feature OIds',
		name: 'oIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of OIds to filter by',
	},
	{
		displayName: 'Offering OId',
		name: 'offeringOId',
		type: 'string',
		default: '',
		description: 'Filter by offering OId',
	},
	{
		displayName: 'Product OId',
		name: 'productOId',
		type: 'string',
		default: '',
		description: 'Filter by product OId',
	},
	{
		displayName: 'Text Search Query',
		name: 'textSearchQuery',
		type: 'string',
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
		resource: ['coreFeature'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oIds = this.getNodeParameter('oIds', itemIndex) as string;
	const offeringOId = this.getNodeParameter('offeringOId', itemIndex) as string;
	const productOId = this.getNodeParameter('productOId', itemIndex) as string;
	const textSearchQuery = this.getNodeParameter('textSearchQuery', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (oIds) qs.oIds = oIds.split(',').map(id => id.trim());
	if (offeringOId) qs.offeringOId = offeringOId;
	if (productOId) qs.productOId = productOId;
	if (textSearchQuery) qs.textSearchQuery = textSearchQuery;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/core-feature/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
