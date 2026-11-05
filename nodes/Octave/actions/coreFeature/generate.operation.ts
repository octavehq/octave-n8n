import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Primary Offering Name or ID',
		name: 'primaryOfferingOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProducts' },
		required: true,
		default: '',
		description: 'Parent offering the generated core features belong to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Core Feature Generation Requests',
		name: 'coreFeatures',
		type: 'fixedCollection',
		placeholder: 'Add Core Feature',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Each request generates one core feature',
		options: [
			{
				displayName: 'Core Feature',
				name: 'coreFeature',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Optional name; if provided, used as the entity name',
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
		description: 'Brand voice OId to apply to generated core features (optional)',
	},
];

const displayOptions = {
	show: {
		resource: ['coreFeature'],
		operation: ['generate'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (!body.primaryOfferingOId) {
		throw new NodeOperationError(this.getNode(), 'Primary Offering is required to generate core features.', { itemIndex });
	}

	const coreFeaturesRaw = this.getNodeParameter('coreFeatures', itemIndex) as { coreFeature?: Array<{ name?: string; sources: { source?: Array<{ type: string; value: string }> } }> };
	const coreFeatures = (coreFeaturesRaw?.coreFeature || []).map(f => ({
		name: f.name,
		sources: f.sources?.source || [],
	}));
	if (coreFeatures.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one core feature generation request is required.', { itemIndex });
	}
	body.coreFeatures = coreFeatures;

	const brandVoiceOId = this.getNodeParameter('brandVoiceOId', itemIndex) as string;
	if (brandVoiceOId) body.brandVoiceOId = brandVoiceOId;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/core-feature/generate', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
