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
		description: 'The external name of the status quo / incumbent alternative',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name of the alternative (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the alternative (optional)',
	},
	{
		displayName: 'Primary Offering OId',
		name: 'primaryOfferingOId',
		type: 'string',
		default: '',
		description: 'Primary offering to use as context when creating the alternative (optional)',
	},
	{
		displayName: 'Where It Works (JSON Array)',
		name: 'whereItWorks',
		type: 'json',
		default: '[]',
		description: 'JSON array — conditions and contexts where this alternative genuinely holds up (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Where It Breaks (JSON Array)',
		name: 'whereItBreaks',
		type: 'json',
		default: '[]',
		description: 'JSON array — concrete failure modes and triggers where this approach stops working (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Who Champions This Approach (JSON Array)',
		name: 'whoChampionsThisApproach',
		type: 'json',
		default: '[]',
		description: 'JSON array — personas or mindsets that advocate for this path (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why Our Approach Is Superior (JSON Array)',
		name: 'whyOurApproachIsSuperior',
		type: 'json',
		default: '[]',
		description: 'JSON array — specific ways the offering addresses gaps and failure modes (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Perceived Benefits (JSON Array)',
		name: 'perceivedBenefits',
		type: 'json',
		default: '[]',
		description: 'JSON array — why this approach feels rational, safe, or good enough (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Hidden Costs and Pitfalls (JSON Array)',
		name: 'hiddenCostsAndPitfalls',
		type: 'json',
		default: '[]',
		description: 'JSON array — non-obvious costs, compounding debt, and second-order risks (optional)',
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
		description: 'Strategy for linking this alternative to products',
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
		resource: ['alternative'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required to create an alternative.', { itemIndex });
	}

	const internalName = this.getNodeParameter('internalName', itemIndex) as string;
	if (internalName) body.internalName = internalName;
	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;
	const primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (primaryOfferingOId) body.primaryOfferingOId = primaryOfferingOId;

	body.whereItWorks = parseJsonParameter.call(this, 'whereItWorks', itemIndex, '[]');
	body.whereItBreaks = parseJsonParameter.call(this, 'whereItBreaks', itemIndex, '[]');
	body.whoChampionsThisApproach = parseJsonParameter.call(this, 'whoChampionsThisApproach', itemIndex, '[]');
	body.whyOurApproachIsSuperior = parseJsonParameter.call(this, 'whyOurApproachIsSuperior', itemIndex, '[]');
	body.perceivedBenefits = parseJsonParameter.call(this, 'perceivedBenefits', itemIndex, '[]');
	body.hiddenCostsAndPitfalls = parseJsonParameter.call(this, 'hiddenCostsAndPitfalls', itemIndex, '[]');
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

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/alternative/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
