import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Brand Voice OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'OId of the brand voice to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Brand voice name (optional)',
	},
	{
		displayName: 'Data (JSON)',
		name: 'data',
		type: 'json',
		default: '{}',
		description: 'Brand voice data object (title, description, essence, personality, tonality, vocabulary, writingRules, audienceConsiderations, customFields)',
		typeOptions: { rows: 10 },
	},
];

const displayOptions = {
	show: {
		resource: ['brandVoice'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'Brand Voice OId is required.', { itemIndex });
	}

	const name = this.getNodeParameter('name', itemIndex) as string;
	if (name) body.name = name;

	const data = parseJsonParameter.call(this, 'data', itemIndex, '{}');
	if (data && Object.keys(data).length > 0) body.data = data;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/brand-voice/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
