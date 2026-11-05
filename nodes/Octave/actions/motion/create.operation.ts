import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Motion name',
	},
	{
		displayName: 'Offering OId',
		name: 'offeringId',
		type: 'string',
		required: true,
		default: '',
		description: 'Offering OId (product or service) this motion belongs to',
	},
	{
		displayName: 'Motion Type',
		name: 'motionType',
		type: 'options',
		options: [
			{ name: 'Convert Free to Paid', value: 'CONVERT_FREE_TO_PAID' },
			{ name: 'Cross Sell', value: 'CROSS_SELL' },
			{ name: 'Displace Incumbent', value: 'DISPLACE_INCUMBENT' },
			{ name: 'Net New', value: 'NET_NEW' },
			{ name: 'Renew and Retain', value: 'RENEW_AND_RETAIN' },
			{ name: 'Upsell', value: 'UPSELL' },
		],
		default: 'NET_NEW',
		description: 'Motion type. Currently only NET_NEW and UPSELL are supported.',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Motion description (optional)',
	},
	{
		displayName: 'Data (JSON)',
		name: 'data',
		type: 'json',
		default: '{}',
		description: 'Motion data as JSON: {"overview": ["..."], "scope": ["..."], "additionalContext": "...", "attachedSources": []}',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['motion'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required to create a motion.', { itemIndex });
	}
	body.offeringId = this.getNodeParameter('offeringId', itemIndex) as string;
	if (!body.offeringId) {
		throw new NodeOperationError(this.getNode(), 'Offering OId is required to create a motion.', { itemIndex });
	}
	body.motionType = this.getNodeParameter('motionType', itemIndex) as string;

	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;

	body.data = parseJsonParameter.call(this, 'data', itemIndex, '{}');

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/motion/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
