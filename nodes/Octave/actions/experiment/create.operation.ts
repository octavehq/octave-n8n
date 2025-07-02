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
		description: 'Name of the experiment',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the experiment',
	},
	{
		displayName: 'Agent Type',
		name: 'agentType',
		type: 'options',
		required: true,
		default: 'CONTENT',
		options: [
			{ name: 'Call Prep', value: 'CALL_PREP' },
			{ name: 'Content', value: 'CONTENT' },
			{ name: 'Email', value: 'EMAIL' },
			{ name: 'Enrich Company', value: 'ENRICH_COMPANY' },
			{ name: 'Enrich Person', value: 'ENRICH_PERSON' },
			{ name: 'Prospector', value: 'PROSPECTOR' },
			{ name: 'Qualify Company', value: 'QUALIFY_COMPANY' },
			{ name: 'Qualify Person', value: 'QUALIFY_PERSON' },
		],
		description: 'Type of agent for the experiment',
	},
	{
		displayName: 'Run Strategy',
		name: 'runStrategy',
		type: 'options',
		required: true,
		default: 'RANDOM',
		options: [
			{ name: 'Random', value: 'RANDOM' },
			{ name: 'Round Robin', value: 'ROUND_ROBIN' },
			{ name: 'Weighted', value: 'WEIGHTED' },
		],
		description: 'Strategy for running the experiment',
	},
	{
		displayName: 'Agent OIds',
		name: 'agentOIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated list of agent OIds to include in the experiment',
	},
	{
		displayName: 'Weights',
		name: 'weights',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				runStrategy: ['WEIGHTED'],
			},
		},
		description: 'Array of weight objects for weighted strategy: [{"oId": "agent_id", "weight": 0.5}]',
	},
];

const displayOptions = {
	show: {
		resource: ['experiment'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	const name = this.getNodeParameter('name', itemIndex) as string;
	if (!name) {
		throw new NodeOperationError(this.getNode(), 'Name is required for this operation.', { itemIndex });
	}
	body.name = name;

	body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
	body.agentType = this.getNodeParameter('agentType', itemIndex) as string;
	body.runStrategy = this.getNodeParameter('runStrategy', itemIndex) as string;

	const agentOIds = this.getNodeParameter('agentOIds', itemIndex) as string;
	if (!agentOIds) {
		throw new NodeOperationError(this.getNode(), 'Agent OIds are required for this operation.', { itemIndex });
	}
	body.agentOIds = agentOIds.split(',').map((id: string) => id.trim());

	const runStrategy = body.runStrategy;
	if (runStrategy === 'WEIGHTED') {
		const weightsString = this.getNodeParameter('weights', itemIndex, '[]') as string;
		if (weightsString && weightsString.trim() !== '[]' && weightsString.trim() !== '') {
			body.weights = parseJsonParameter.call(this, 'weights', itemIndex, '[]');
		}
	}

	Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

	const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/experiment/create', body);
	const responseDataInner = responseDataOuter?.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseDataInner || responseDataOuter || {}),
		{ itemData: { item: itemIndex } },
	);
	return [executionData];
}