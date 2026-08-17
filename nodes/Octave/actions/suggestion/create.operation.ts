import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Change Type',
		name: 'changeType',
		type: 'options',
		options: [
			{ name: 'Add', value: 'add', description: 'Propose a brand new entity' },
			{ name: 'Refine', value: 'refine', description: 'Propose changes to an existing entity' },
		],
		default: 'add',
		description: 'Whether to propose a new entity or refine an existing one',
	},
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'options',
		options: [
			{ name: 'Alternative', value: 'alternative' },
			{ name: 'Brand Voice', value: 'brand_voice' },
			{ name: 'Buying Trigger', value: 'buying_trigger' },
			{ name: 'Competitor', value: 'competitor' },
			{ name: 'Core Feature', value: 'core_feature' },
			{ name: 'Objection', value: 'objection' },
			{ name: 'Persona', value: 'persona' },
			{ name: 'Product', value: 'product' },
			{ name: 'Proof Point', value: 'proof_point' },
			{ name: 'Reference', value: 'reference' },
			{ name: 'Segment', value: 'segment' },
			{ name: 'Service', value: 'service' },
			{ name: 'Solution', value: 'solution' },
			{ name: 'Use Case', value: 'use_case' },
		],
		default: 'persona',
		description: 'The library entity type the suggestion targets',
	},
	{
		displayName: 'Instructions',
		name: 'instructions',
		type: 'string',
		required: true,
		default: '',
		description: 'Detailed natural-language description of what to add or change',
		typeOptions: { rows: 4 },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the new entity (required when Change Type is Add)',
		displayOptions: {
			show: { changeType: ['add'] },
		},
	},
	{
		displayName: 'Entity OId',
		name: 'entityOId',
		type: 'string',
		default: '',
		description: 'OId of the entity to refine (required when Change Type is Refine)',
		displayOptions: {
			show: { changeType: ['refine'] },
		},
	},
	{
		displayName: 'Key Context',
		name: 'keyContext',
		type: 'string',
		default: '',
		description: 'Additional background text to inform the proposal (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'fixedCollection',
		placeholder: 'Add Source',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Source materials for the suggestion (optional)',
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
							{ name: 'Text', value: 'text' },
							{ name: 'URL', value: 'url' },
						],
						default: 'text',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						default: '',
						description: 'The URL to fetch or the text content',
						typeOptions: { rows: 3 },
					},
				],
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['suggestion'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.changeType = this.getNodeParameter('changeType', itemIndex) as string;
	body.entityType = this.getNodeParameter('entityType', itemIndex) as string;
	body.instructions = this.getNodeParameter('instructions', itemIndex) as string;
	if (!body.instructions) {
		throw new NodeOperationError(this.getNode(), 'Instructions are required to create a suggestion.', { itemIndex });
	}

	if (body.changeType === 'add') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		if (!name) {
			throw new NodeOperationError(this.getNode(), 'Name is required when Change Type is Add.', { itemIndex });
		}
		body.name = name;
	} else {
		const entityOId = this.getNodeParameter('entityOId', itemIndex) as string;
		if (!entityOId) {
			throw new NodeOperationError(this.getNode(), 'Entity OId is required when Change Type is Refine.', { itemIndex });
		}
		body.oId = entityOId;
	}

	const keyContext = this.getNodeParameter('keyContext', itemIndex) as string;
	if (keyContext) body.keyContext = keyContext;

	const sourcesRaw = this.getNodeParameter('sources', itemIndex) as { source?: Array<{ type: string; content: string }> };
	const sources = sourcesRaw?.source || [];
	if (sources.length > 0) body.sources = sources;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/suggestion/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
