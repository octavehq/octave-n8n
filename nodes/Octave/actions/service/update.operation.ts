import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Service OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'OId of the service to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'External name of the service (optional)',
	},
	{
		displayName: 'Internal Name',
		name: 'internalName',
		type: 'string',
		default: '',
		description: 'Internal name of the service (optional)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the service (optional)',
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string',
		default: '',
		description: 'Brief summary of the service (optional)',
	},
	{
		displayName: 'Primary URL',
		name: 'primaryUrl',
		type: 'string',
		default: '',
		description: 'Primary URL for the service (optional)',
	},
	{
		displayName: 'Deliverables (JSON Array)',
		name: 'deliverables',
		type: 'json',
		default: '[]',
		description: 'JSON array of key deliverables (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Competencies (JSON Array)',
		name: 'competencies',
		type: 'json',
		default: '[]',
		description: 'JSON array of competencies required (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Customer Benefits (JSON Array)',
		name: 'customerBenefits',
		type: 'json',
		default: '[]',
		description: 'JSON array of customer benefits (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Challenges Addressed (JSON Array)',
		name: 'challengesAddressed',
		type: 'json',
		default: '[]',
		description: 'JSON array of challenges addressed (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Comparative Advantage (JSON Array)',
		name: 'comparativeAdvantage',
		type: 'json',
		default: '[]',
		description: 'JSON array of comparative advantages (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Likely Alternative (JSON Array)',
		name: 'likelyAlternative',
		type: 'json',
		default: '[]',
		description: 'JSON array of likely alternatives (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Custom Fields (JSON Array)',
		name: 'customFields',
		type: 'json',
		default: '[]',
		description: 'JSON array of custom fields: [{"title": "field", "value": ["item1", "item2"]}] (optional)',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['service'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'Service OId is required to update a service.', { itemIndex });
	}

	body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
	body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
	body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
	body.summary = this.getNodeParameter('summary', itemIndex) as string | undefined;
	body.primaryUrl = this.getNodeParameter('primaryUrl', itemIndex) as string | undefined;
	body.deliverables = parseJsonParameter.call(this, 'deliverables', itemIndex, '[]');
	body.competencies = parseJsonParameter.call(this, 'competencies', itemIndex, '[]');
	body.customerBenefits = parseJsonParameter.call(this, 'customerBenefits', itemIndex, '[]');
	body.challengesAddressed = parseJsonParameter.call(this, 'challengesAddressed', itemIndex, '[]');
	body.comparativeAdvantage = parseJsonParameter.call(this, 'comparativeAdvantage', itemIndex, '[]');
	body.likelyAlternative = parseJsonParameter.call(this, 'likelyAlternative', itemIndex, '[]');
	body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

	Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/service/update', body);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	);
	return [executionData];
}
