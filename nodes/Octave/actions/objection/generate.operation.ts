import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Primary Offering Name or ID',
		name: 'primaryOfferingOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProducts' },
		default: '',
		description: 'Primary offering for context (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Objection Generation Requests',
		name: 'objections',
		type: 'fixedCollection',
		placeholder: 'Add Objection',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Each request generates one objection',
		options: [
			{
				displayName: 'Objection',
				name: 'objection',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Optional label; if provided, used as the entity name',
					},
					{
						displayName: 'Sources',
						name: 'sources',
						type: 'fixedCollection',
						placeholder: 'Add Source',
						typeOptions: { multipleValues: true },
						default: {},
						options: [
							{
								displayName: 'Source',
								name: 'source',
								values: [
									{
										displayName: 'Type',
										name: 'type',
										type: 'options',
										options: [
											{ name: 'Text', value: 'TEXT' },
											{ name: 'URL', value: 'URL' },
											{ name: 'Resource', value: 'RESOURCE' },
										],
										default: 'TEXT',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										typeOptions: { rows: 3 },
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Brand Voice OId',
		name: 'brandVoiceOId',
		type: 'string',
		default: '',
		description: 'Brand voice OId to apply to generated objections (optional)',
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
		description: 'Strategy for linking generated objections to products',
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
		operation: ['generate'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	const primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (primaryOfferingOId) body.primaryOfferingOId = primaryOfferingOId;

	const objectionsRaw = this.getNodeParameter('objections', itemIndex) as { objection?: Array<{ name?: string; sources: { source?: Array<{ type: string; value: string }> } }> };
	const objections = (objectionsRaw?.objection || []).map(o => ({
		name: o.name,
		sources: o.sources?.source || [],
	}));
	if (objections.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one objection generation request is required.', { itemIndex });
	}
	body.objections = objections;

	const brandVoiceOId = this.getNodeParameter('brandVoiceOId', itemIndex) as string;
	if (brandVoiceOId) body.brandVoiceOId = brandVoiceOId;

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

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/objection/generate', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
