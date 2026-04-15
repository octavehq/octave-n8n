import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the brand voice',
	},
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'fixedCollection',
		placeholder: 'Add Source',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Source materials to analyze for brand voice generation (at least one required)',
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
];

const displayOptions = {
	show: {
		resource: ['brandVoice'],
		operation: ['generate'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const name = this.getNodeParameter('name', itemIndex) as string;
	const sourcesRaw = this.getNodeParameter('sources', itemIndex) as { source?: Array<{ type: string; value: string }> };
	const sources = sourcesRaw?.source || [];

	if (!name) {
		throw new NodeOperationError(this.getNode(), 'Name is required.', { itemIndex });
	}
	if (sources.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one source is required.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/brand-voice/generate', { name, sources });

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
