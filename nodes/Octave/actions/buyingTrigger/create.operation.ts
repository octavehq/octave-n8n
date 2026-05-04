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
		description: 'External name of the buying trigger',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name of the buying trigger (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the buying trigger (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why This Creates Urgency (JSON Array)',
		name: 'whyThisCreatesUrgency',
		type: 'json',
		default: '[]',
		description: 'String array — why this moment shifts the buyer from passive to active',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Who Feels This Most (JSON Array)',
		name: 'whoFeelsThisMost',
		type: 'json',
		default: '[]',
		description: 'String array — which organizations and roles feel this trigger most',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Cost of Inaction (JSON Array)',
		name: 'costOfInaction',
		type: 'json',
		default: '[]',
		description: 'String array — consequences of waiting while this trigger is in play',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'How We Help in This Moment (JSON Array)',
		name: 'howWeHelpInThisMoment',
		type: 'json',
		default: '[]',
		description: 'String array — concrete ways the offering maps to this moment',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Custom Fields (JSON Array)',
		name: 'customFields',
		type: 'json',
		default: '[]',
		description: 'JSON array: [{"title": "field", "value": ["item1"]}] (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Primary Offering Name or ID',
		name: 'primaryOfferingOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProducts' },
		default: '',
		description: 'Primary offering for context (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Linking Strategy Mode',
		name: 'linkingMode',
		type: 'options',
		options: [
			{ name: 'None', value: 'NONE' },
			{ name: 'All Products', value: 'ALL' },
			{ name: 'Specific Products', value: 'SPECIFIC' },
		],
		default: 'NONE',
		description: 'Strategy for linking this buying trigger to products',
	},
	{
		displayName: 'Product Names or IDs',
		name: 'offeringOIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getProducts' },
		default: [],
		description: 'Products to link to (required when using Specific Products mode). Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: { linkingMode: ['SPECIFIC'] },
		},
	},
];

const displayOptions = {
	show: {
		resource: ['buyingTrigger'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required.', { itemIndex });
	}

	const internalName = this.getNodeParameter('internalName', itemIndex) as string;
	if (internalName) body.internalName = internalName;

	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;

	const arrFields = ['whyThisCreatesUrgency', 'whoFeelsThisMost', 'costOfInaction', 'howWeHelpInThisMoment'];
	for (const f of arrFields) {
		const v = parseJsonParameter.call(this, f, itemIndex, '[]');
		if (Array.isArray(v) && v.length > 0) body[f] = v;
	}

	const customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');
	if (Array.isArray(customFields) && customFields.length > 0) body.customFields = customFields;

	const primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (primaryOfferingOId) body.primaryOfferingOId = primaryOfferingOId;

	const linkingMode = this.getNodeParameter('linkingMode', itemIndex) as string;
	if (linkingMode === 'ALL') {
		body.linkingStrategy = { mode: 'ALL' };
	} else if (linkingMode === 'SPECIFIC') {
		const offeringOIds = this.getNodeParameter('offeringOIds', itemIndex) as string[];
		if (!offeringOIds || offeringOIds.length === 0) {
			throw new NodeOperationError(this.getNode(), 'Products are required when using Specific Products mode.', { itemIndex });
		}
		body.linkingStrategy = { mode: 'SPECIFIC', offeringOIds };
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/buying-trigger/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
