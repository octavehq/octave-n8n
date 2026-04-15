import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'fixedCollection',
		placeholder: 'Add Source',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Source materials to apply brand voice to (at least one required)',
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
						description: 'The source content (text, URL, or resource OId)',
						typeOptions: { rows: 3 },
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
		description: 'Brand Voice OId to apply. If not provided, uses workspace default.',
	},
	{
		displayName: 'Model Type',
		name: 'modelType',
		type: 'options',
		options: [
			{ name: 'Chorus', value: 'CHORUS' },
			{ name: 'Echo (20 Credits)', value: 'ECHO' },
			{ name: 'Harmony', value: 'HARMONY' },
			{ name: 'Note (5 Credits)', value: 'NOTE' },
			{ name: 'Pulse (10 Credits)', value: 'PULSE' },
			{ name: 'Symphony', value: 'SYMPHONY' },
		],
		default: 'PULSE',
		description: 'Model quality tier',
	},
	{
		displayName: 'Include Original',
		name: 'includeOriginal',
		type: 'boolean',
		default: false,
		description: 'Whether to include the original expanded content in the response',
	},
];

const displayOptions = {
	show: {
		resource: ['brandVoice'],
		operation: ['apply'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const sourcesRaw = this.getNodeParameter('sources', itemIndex) as { source?: Array<{ type: string; value: string }> };
	const sources = sourcesRaw?.source || [];

	if (sources.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one source is required.', { itemIndex });
	}

	const body: Record<string, any> = { sources };

	const brandVoiceOId = this.getNodeParameter('brandVoiceOId', itemIndex) as string;
	if (brandVoiceOId) body.brandVoiceOId = brandVoiceOId;

	const modelType = this.getNodeParameter('modelType', itemIndex) as string;
	if (modelType) body.modelType = modelType;

	body.includeOriginal = this.getNodeParameter('includeOriginal', itemIndex) as boolean;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/brand-voice/apply', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
