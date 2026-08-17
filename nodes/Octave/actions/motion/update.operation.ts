import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the motion to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New name (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'New description (optional)',
	},
	{
		displayName: 'Offering OId',
		name: 'offeringId',
		type: 'string',
		default: '',
		description: 'New offering OId (optional)',
	},
	{
		displayName: 'Motion Type',
		name: 'motionType',
		type: 'options',
		options: [
			{ name: 'Convert Free to Paid', value: 'CONVERT_FREE_TO_PAID' },
			{ name: 'Cross Sell', value: 'CROSS_SELL' },
			{ name: 'Displace Incumbent', value: 'DISPLACE_INCUMBENT' },
			{ name: 'Keep Current', value: '' },
			{ name: 'Net New', value: 'NET_NEW' },
			{ name: 'Renew and Retain', value: 'RENEW_AND_RETAIN' },
			{ name: 'Upsell', value: 'UPSELL' },
		],
		default: '',
		description: 'New motion type (optional). Currently only NET_NEW and UPSELL are supported.',
	},
	{
		displayName: 'Data (JSON)',
		name: 'data',
		type: 'json',
		default: '',
		description: 'Motion data as JSON (optional, leave empty to keep current): {"overview": ["..."], "scope": ["..."], "additionalContext": "..."}',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['motion'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update a motion.', { itemIndex });
	}

	for (const field of ['name', 'description', 'offeringId', 'motionType']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) body[field] = value;
	}

	const dataRaw = this.getNodeParameter('data', itemIndex, '') as string;
	if (dataRaw && dataRaw.trim() !== '') {
		body.data = parseJsonParameter.call(this, 'data', itemIndex, '{}');
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/motion/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
