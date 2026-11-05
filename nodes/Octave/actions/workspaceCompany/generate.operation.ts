import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '',
		description: 'The domain or URL to scrape and generate the workspace company from',
	},
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'fixedCollection',
		placeholder: 'Add Source',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Additional source materials (optional)',
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
];

const displayOptions = {
	show: {
		resource: ['workspaceCompany'],
		operation: ['generate'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	const domain = this.getNodeParameter('domain', itemIndex) as string;
	if (domain) body.domain = domain;

	const sourcesRaw = this.getNodeParameter('sources', itemIndex) as { source?: Array<{ type: string; value: string }> };
	const sources = sourcesRaw?.source || [];
	if (sources.length > 0) body.sources = sources;

	if (!domain && sources.length === 0) {
		throw new NodeOperationError(this.getNode(), 'A domain or at least one source is required to generate the workspace company.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/workspace-company/generate', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
