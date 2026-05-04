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
		description: 'Solution name',
	},
	{
		displayName: 'Solution Data (JSON)',
		name: 'solutionData',
		type: 'json',
		default: '{}',
		description: 'Optional additional fields: internalName, summary, description, distinctCapabilities, keyComponents, customerBenefits, challengesAddressed, statusQuo, differentiatedValue, customFields',
		typeOptions: { rows: 6 },
	},
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'fixedCollection',
		placeholder: 'Add Source',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Source materials (at least one required)',
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
							{ name: 'Company Name', value: 'COMPANY_NAME' },
							{ name: 'Generative Name', value: 'GENERATIVE_NAME' },
							{ name: 'OId', value: 'OID' },
							{ name: 'Resource', value: 'RESOURCE' },
							{ name: 'Text', value: 'TEXT' },
							{ name: 'URL', value: 'URL' },
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
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Details',
						name: 'details',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'Enable RAG Enrichment',
		name: 'enableRagEnrichment',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Linked Entity OIds (JSON)',
		name: 'linkedEntities',
		type: 'json',
		default: '{}',
		description: 'Optional object with OId arrays: offeringOIds, useCaseOIds, personaOIds, segmentOIds, referenceOIds, collateralOIds, competitorOIds, alternativeOIds, buyingTriggerOIds, proofPointOIds, genericTextEntityOIds',
		typeOptions: { rows: 6 },
	},
];

const displayOptions = {
	show: {
		resource: ['solution'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const name = this.getNodeParameter('name', itemIndex) as string;
	if (!name) {
		throw new NodeOperationError(this.getNode(), 'Name is required.', { itemIndex });
	}

	const solutionData = parseJsonParameter.call(this, 'solutionData', itemIndex, '{}');
	const sourcesRaw = this.getNodeParameter('sources', itemIndex) as { source?: Array<any> };
	const sources = sourcesRaw?.source || [];
	if (sources.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one source is required.', { itemIndex });
	}

	const body: Record<string, any> = {
		solution: { name, ...solutionData },
		sources,
		active: this.getNodeParameter('active', itemIndex) as boolean,
		enableRagEnrichment: this.getNodeParameter('enableRagEnrichment', itemIndex) as boolean,
	};

	const linked = parseJsonParameter.call(this, 'linkedEntities', itemIndex, '{}');
	for (const k of Object.keys(linked || {})) {
		if (Array.isArray(linked[k]) && linked[k].length > 0) body[k] = linked[k];
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/solution/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
