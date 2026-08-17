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
		description: 'External name of the objection',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name of the objection (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the objection (optional)',
	},
	{
		displayName: 'Primary Offering OId',
		name: 'primaryOfferingOId',
		type: 'string',
		default: '',
		description: 'Primary offering for context when creating the objection (optional)',
	},
	{
		displayName: 'Underlying Concern (JSON Array)',
		name: 'underlyingConcern',
		type: 'json',
		default: '[]',
		description: 'JSON array — what the buyer is really worried about (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Assumptions and Misconceptions (JSON Array)',
		name: 'assumptionsAndMisconceptions',
		type: 'json',
		default: '[]',
		description: 'JSON array — mistaken beliefs to address (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Areas to Probe and Clarify (JSON Array)',
		name: 'areasToProbeAndClarify',
		type: 'json',
		default: '[]',
		description: 'JSON array — discovery questions or topics to clarify (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Reframe and Response (JSON Array)',
		name: 'reframeAndResponse',
		type: 'json',
		default: '[]',
		description: 'JSON array — how to reframe and respond (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Custom Fields (JSON Array)',
		name: 'customFields',
		type: 'json',
		default: '[]',
		description: 'JSON array of custom fields: [{"title": "field", "value": ["item1", "item2"]}] (optional)',
		typeOptions: { rows: 5 },
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
		description: 'Strategy for linking this objection to products',
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
		resource: ['objection'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required to create an objection.', { itemIndex });
	}

	const internalName = this.getNodeParameter('internalName', itemIndex) as string;
	if (internalName) body.internalName = internalName;
	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;
	const primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (primaryOfferingOId) body.primaryOfferingOId = primaryOfferingOId;

	body.underlyingConcern = parseJsonParameter.call(this, 'underlyingConcern', itemIndex, '[]');
	body.assumptionsAndMisconceptions = parseJsonParameter.call(this, 'assumptionsAndMisconceptions', itemIndex, '[]');
	body.areasToProbeAndClarify = parseJsonParameter.call(this, 'areasToProbeAndClarify', itemIndex, '[]');
	body.reframeAndResponse = parseJsonParameter.call(this, 'reframeAndResponse', itemIndex, '[]');
	body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

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

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/objection/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
