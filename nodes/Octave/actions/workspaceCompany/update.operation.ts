import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'The external name of the workspace company (optional)',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'The internal name of the workspace company (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'A description of the workspace company (optional)',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'The website URL for the workspace company (optional)',
	},
	{
		displayName: 'Why We Exist (JSON Array)',
		name: 'whyWeExist',
		type: 'json',
		default: '',
		description: 'JSON array — why the company exists (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'How We Position Ourselves (JSON Array)',
		name: 'howWePositionOurselves',
		type: 'json',
		default: '',
		description: 'JSON array — how the company positions itself in the market (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Who We Help (JSON Array)',
		name: 'whoWeHelp',
		type: 'json',
		default: '',
		description: 'JSON array — who the company helps (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'What Makes Us Unique (JSON Array)',
		name: 'whatMakesUsUnique',
		type: 'json',
		default: '',
		description: 'JSON array — what makes the company unique (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Business Model (JSON Array)',
		name: 'businessModel',
		type: 'json',
		default: '',
		description: 'JSON array — the company business model (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Market Dynamics (JSON Array)',
		name: 'marketDynamics',
		type: 'json',
		default: '',
		description: 'JSON array — market dynamics the company operates within (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why Customers Buy (JSON Array)',
		name: 'whyCustomersBuy',
		type: 'json',
		default: '',
		description: 'JSON array — why customers buy (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why Customers Care (JSON Array)',
		name: 'whyCustomersCare',
		type: 'json',
		default: '',
		description: 'JSON array — why customers care (optional, leave empty to keep current)',
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
	{
		displayName: 'Custom Market Fields (JSON Array)',
		name: 'customMarketFields',
		type: 'json',
		default: '',
		description: 'JSON array of custom market fields (optional, leave empty to keep current)',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['workspaceCompany'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	for (const field of ['name', 'internalName', 'description', 'url']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) body[field] = value;
	}

	for (const field of ['whyWeExist', 'howWePositionOurselves', 'whoWeHelp', 'whatMakesUsUnique', 'businessModel', 'marketDynamics', 'whyCustomersBuy', 'whyCustomersCare', 'customFields', 'customMarketFields']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '[]');
		}
	}

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one field must be provided to update the workspace company.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/workspace-company/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
