import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion OId',
		name: 'motionOId',
		type: 'string',
		default: '',
		description: 'Filter by motion OId',
	},
	{
		displayName: 'Offering OId',
		name: 'offeringOId',
		type: 'string',
		default: '',
		description: 'Filter by offering OId',
	},
	{
		displayName: 'Motion Type',
		name: 'motionType',
		type: 'options',
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Convert Free to Paid', value: 'CONVERT_FREE_TO_PAID' },
			{ name: 'Cross Sell', value: 'CROSS_SELL' },
			{ name: 'Displace Incumbent', value: 'DISPLACE_INCUMBENT' },
			{ name: 'Net New', value: 'NET_NEW' },
			{ name: 'Renew and Retain', value: 'RENEW_AND_RETAIN' },
			{ name: 'Upsell', value: 'UPSELL' },
		],
		default: '',
		description: 'Filter by motion type',
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
		resource: ['motionPlaybook'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const motionOId = this.getNodeParameter('motionOId', itemIndex) as string;
	const offeringOId = this.getNodeParameter('offeringOId', itemIndex) as string;
	const motionType = this.getNodeParameter('motionType', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const offset = this.getNodeParameter('offset', itemIndex) as number;

	const qs: any = {};
	if (motionOId) qs.motionOId = motionOId;
	if (offeringOId) qs.offeringOId = offeringOId;
	if (motionType) qs.motionType = motionType;
	if (limit) qs.limit = limit;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/motion-playbook/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
