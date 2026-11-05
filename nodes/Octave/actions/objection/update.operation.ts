import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Objection OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the objection to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New name for the objection (optional)',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'New internal name (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'New description (optional)',
	},
	{
		displayName: 'Underlying Concern (JSON Array)',
		name: 'underlyingConcern',
		type: 'json',
		default: '',
		description: 'JSON array — what the buyer is really worried about (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Assumptions and Misconceptions (JSON Array)',
		name: 'assumptionsAndMisconceptions',
		type: 'json',
		default: '',
		description: 'JSON array — mistaken beliefs to address (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Areas to Probe and Clarify (JSON Array)',
		name: 'areasToProbeAndClarify',
		type: 'json',
		default: '',
		description: 'JSON array — discovery questions or topics to clarify (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Reframe and Response (JSON Array)',
		name: 'reframeAndResponse',
		type: 'json',
		default: '',
		description: 'JSON array — how to reframe and respond (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Custom Fields (JSON Array)',
		name: 'customFields',
		type: 'json',
		default: '',
		description: 'JSON array of custom fields (optional, leave empty to keep current)',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['objection'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update an objection.', { itemIndex });
	}

	for (const field of ['name', 'internalName', 'description']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) body[field] = value;
	}

	for (const field of ['underlyingConcern', 'assumptionsAndMisconceptions', 'areasToProbeAndClarify', 'reframeAndResponse', 'customFields']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '[]');
		}
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/objection/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
