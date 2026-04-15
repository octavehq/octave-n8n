import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Agent Name or ID',
		name: 'agentOId',
		type: 'options',
		required: true,
		typeOptions: { loadOptionsMethod: 'getAgents' },
		default: '',
		description: 'Context agent OId. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		description: 'Question or task to fetch context for',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Runtime Context',
		name: 'runtimeContext',
		type: 'string',
		default: '',
		description: 'Runtime context string — used as the query if Query is not provided',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Additional Context (JSON)',
		name: 'additionalContext',
		type: 'json',
		default: '{}',
		description: 'Optional person/company/details to enhance search: { person: {firstName, lastName, title, email, ...}, company: {name, domain, ...}, details: "..." }',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['runContext'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const agentOId = this.getNodeParameter('agentOId', itemIndex) as string;
	if (!agentOId) {
		throw new NodeOperationError(this.getNode(), 'Agent OId is required.', { itemIndex });
	}

	const body: Record<string, any> = { agentOId };

	const query = this.getNodeParameter('query', itemIndex) as string;
	if (query) body.query = query;
	const runtimeContext = this.getNodeParameter('runtimeContext', itemIndex) as string;
	if (runtimeContext) body.runtimeContext = runtimeContext;

	const additionalContext = parseJsonParameter.call(this, 'additionalContext', itemIndex, '{}');
	if (additionalContext && Object.keys(additionalContext).length > 0) body.additionalContext = additionalContext;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/context/run', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
