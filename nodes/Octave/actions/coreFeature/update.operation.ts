import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Core Feature OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the core feature to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New name for the core feature (optional)',
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
		displayName: 'What It Does (JSON Array)',
		name: 'whatItDoes',
		type: 'json',
		default: '',
		description: 'JSON array — concrete capabilities this feature delivers (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'How It Works (JSON Array)',
		name: 'howItWorks',
		type: 'json',
		default: '',
		description: 'JSON array — how the capability is delivered under the hood (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'What It Impacts (JSON Array)',
		name: 'whatItImpacts',
		type: 'json',
		default: '',
		description: 'JSON array — outcomes and metrics this feature moves (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why This Exists (JSON Array)',
		name: 'whyThisExists',
		type: 'json',
		default: '',
		description: 'JSON array — the problem or gap that justifies this feature (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['coreFeature'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update a core feature.', { itemIndex });
	}

	for (const field of ['name', 'internalName', 'description']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) body[field] = value;
	}

	for (const field of ['whatItDoes', 'howItWorks', 'whatItImpacts', 'whyThisExists']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '[]');
		}
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/core-feature/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
