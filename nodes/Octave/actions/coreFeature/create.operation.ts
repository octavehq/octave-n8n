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
		description: 'The external name of the core feature (named capability)',
	},
	{
		displayName: 'Primary Offering OId',
		name: 'primaryOfferingOId',
		type: 'string',
		required: true,
		default: '',
		description: 'Parent offering (product, service, or solution) this core feature belongs to',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name of the core feature (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the core feature (optional)',
	},
	{
		displayName: 'What It Does (JSON Array)',
		name: 'whatItDoes',
		type: 'json',
		default: '[]',
		description: 'JSON array — concrete capabilities this feature delivers (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'How It Works (JSON Array)',
		name: 'howItWorks',
		type: 'json',
		default: '[]',
		description: 'JSON array — how the capability is delivered under the hood (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'What It Impacts (JSON Array)',
		name: 'whatItImpacts',
		type: 'json',
		default: '[]',
		description: 'JSON array — outcomes and metrics this feature moves (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why This Exists (JSON Array)',
		name: 'whyThisExists',
		type: 'json',
		default: '[]',
		description: 'JSON array — the problem or gap that justifies this feature (optional)',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['coreFeature'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required to create a core feature.', { itemIndex });
	}
	body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
	if (!body.primaryOfferingOId) {
		throw new NodeOperationError(this.getNode(), 'Primary Offering OId is required to create a core feature.', { itemIndex });
	}

	const internalName = this.getNodeParameter('internalName', itemIndex) as string;
	if (internalName) body.internalName = internalName;
	const description = this.getNodeParameter('description', itemIndex) as string;
	if (description) body.description = description;

	body.whatItDoes = parseJsonParameter.call(this, 'whatItDoes', itemIndex, '[]');
	body.howItWorks = parseJsonParameter.call(this, 'howItWorks', itemIndex, '[]');
	body.whatItImpacts = parseJsonParameter.call(this, 'whatItImpacts', itemIndex, '[]');
	body.whyThisExists = parseJsonParameter.call(this, 'whyThisExists', itemIndex, '[]');

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/core-feature/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
