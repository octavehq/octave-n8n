import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Offering OId',
		name: 'offeringOId',
		type: 'string',
		default: '',
		description: 'Filter by offering OId',
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
		resource: ['motion'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const offeringOId = this.getNodeParameter('offeringOId', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (offeringOId) qs.offeringOId = offeringOId;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/motion/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
