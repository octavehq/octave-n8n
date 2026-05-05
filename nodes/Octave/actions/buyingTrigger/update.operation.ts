import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Buying Trigger OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'OId of the buying trigger to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the buying trigger (optional)',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why This Creates Urgency (JSON Array)',
		name: 'whyThisCreatesUrgency',
		type: 'json',
		default: '[]',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Who Feels This Most (JSON Array)',
		name: 'whoFeelsThisMost',
		type: 'json',
		default: '[]',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Cost of Inaction (JSON Array)',
		name: 'costOfInaction',
		type: 'json',
		default: '[]',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'How We Help in This Moment (JSON Array)',
		name: 'howWeHelpInThisMoment',
		type: 'json',
		default: '[]',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Custom Fields (JSON Array)',
		name: 'customFields',
		type: 'json',
		default: '[]',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['buyingTrigger'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}

	const name = this.getNodeParameter('name', itemIndex) as string;
	if (name) body.name = name;
	const internalName = this.getNodeParameter('internalName', itemIndex) as string;
	if (internalName) body.internalName = internalName;
	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;

	const arrFields = ['whyThisCreatesUrgency', 'whoFeelsThisMost', 'costOfInaction', 'howWeHelpInThisMoment', 'customFields'];
	for (const f of arrFields) {
		const v = parseJsonParameter.call(this, f, itemIndex, '[]');
		if (Array.isArray(v) && v.length > 0) body[f] = v;
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/buying-trigger/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
