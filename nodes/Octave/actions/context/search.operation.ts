import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		description: 'Question or task to fetch context for',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Top K',
		name: 'topK',
		type: 'number',
		default: 0,
		description: 'Number of results to return (0 = API default)',
	},
	{
		displayName: 'Rerank',
		name: 'rerank',
		type: 'options',
		options: [
			{ name: 'API Default', value: '' },
			{ name: 'Best', value: 'best' },
			{ name: 'High', value: 'high' },
			{ name: 'Low', value: 'low' },
			{ name: 'Medium', value: 'medium' },
			{ name: 'Off', value: 'off' },
		],
		default: '',
		description: 'Reranking effort level',
	},
	{
		displayName: 'Additional Context (JSON)',
		name: 'additionalContext',
		type: 'json',
		default: '',
		description: 'Optional JSON: {"person": {...}, "company": {...}, "details": "..."}',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Sources (JSON)',
		name: 'sources',
		type: 'json',
		default: '',
		description: 'Optional JSON controlling which sources to search: {"library": {...}, "resources": {...}}',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Tools (JSON)',
		name: 'tools',
		type: 'json',
		default: '',
		description: 'Optional JSON enabling tools: {"personProfile": {...}, "companyProfile": {...}, "companyResearch": {...}, "personResearch": {...}, "deepWebResearch": {...}}',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Agent Tools (JSON)',
		name: 'agentTools',
		type: 'json',
		default: '',
		description: 'Optional JSON enabling agent tools: {"brandVoice": {...}, "webSearch": {...}, ...}',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Reasoning (JSON)',
		name: 'reasoning',
		type: 'json',
		default: '',
		description: 'Optional JSON: {"perDocument": bool, "overall": bool}',
		typeOptions: { rows: 2 },
	},
	{
		displayName: 'Common Context (JSON)',
		name: 'commonContext',
		type: 'json',
		default: '',
		description: 'Optional JSON with common context options (accountBasedMode, entities, sources, page, etc.)',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['context'],
		operation: ['search'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.query = this.getNodeParameter('query', itemIndex) as string;
	if (!body.query) {
		throw new NodeOperationError(this.getNode(), 'Query is required.', { itemIndex });
	}

	const topK = this.getNodeParameter('topK', itemIndex) as number;
	if (topK) body.topK = topK;
	const rerank = this.getNodeParameter('rerank', itemIndex) as string;
	if (rerank) body.rerank = rerank;

	for (const field of ['additionalContext', 'sources', 'tools', 'agentTools', 'reasoning', 'commonContext']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '{}');
		}
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/context', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
