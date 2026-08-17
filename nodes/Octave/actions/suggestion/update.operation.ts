import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Suggestion OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the suggestion to revise (only pending suggestions can be revised)',
	},
	{
		displayName: 'Instructions',
		name: 'instructions',
		type: 'string',
		default: '',
		description: 'REGENERATE mode: natural-language instructions for how to change the proposal (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Instructions Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Replace', value: 'replace', description: 'Swap the previous instructions' },
			{ name: 'Append', value: 'append', description: 'Add to the previous instructions' },
		],
		default: 'replace',
		description: 'How to apply the instructions',
	},
	{
		displayName: 'Edits (JSON)',
		name: 'edits',
		type: 'json',
		default: '',
		description: 'OVERRIDE mode: a partial patch of fields on the proposed entity (optional)',
		typeOptions: { rows: 4 },
	},
];

const displayOptions = {
	show: {
		resource: ['suggestion'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update a suggestion.', { itemIndex });
	}

	const instructions = this.getNodeParameter('instructions', itemIndex) as string;
	if (instructions) {
		body.instructions = instructions;
		body.mode = this.getNodeParameter('mode', itemIndex) as string;
	}

	const editsRaw = this.getNodeParameter('edits', itemIndex, '') as string;
	if (editsRaw && editsRaw.trim() !== '') {
		body.edits = parseJsonParameter.call(this, 'edits', itemIndex, '{}');
	}

	if (!body.instructions && !body.edits) {
		throw new NodeOperationError(this.getNode(), 'Either Instructions or Edits must be provided.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/suggestion/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
