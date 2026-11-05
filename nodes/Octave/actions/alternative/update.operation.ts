import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Alternative OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the alternative to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New name for the alternative (optional)',
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
		displayName: 'Where It Works (JSON Array)',
		name: 'whereItWorks',
		type: 'json',
		default: '',
		description: 'JSON array — conditions and contexts where this alternative genuinely holds up (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Where It Breaks (JSON Array)',
		name: 'whereItBreaks',
		type: 'json',
		default: '',
		description: 'JSON array — concrete failure modes and triggers (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Who Champions This Approach (JSON Array)',
		name: 'whoChampionsThisApproach',
		type: 'json',
		default: '',
		description: 'JSON array — personas or mindsets that advocate for this path (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Why Our Approach Is Superior (JSON Array)',
		name: 'whyOurApproachIsSuperior',
		type: 'json',
		default: '',
		description: 'JSON array — specific ways the offering addresses gaps (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Perceived Benefits (JSON Array)',
		name: 'perceivedBenefits',
		type: 'json',
		default: '',
		description: 'JSON array — why this approach feels rational or safe (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Hidden Costs and Pitfalls (JSON Array)',
		name: 'hiddenCostsAndPitfalls',
		type: 'json',
		default: '',
		description: 'JSON array — non-obvious costs and second-order risks (optional, leave empty to keep current)',
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
		resource: ['alternative'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update an alternative.', { itemIndex });
	}

	for (const field of ['name', 'internalName', 'description']) {
		const value = this.getNodeParameter(field, itemIndex) as string;
		if (value) body[field] = value;
	}

	for (const field of ['whereItWorks', 'whereItBreaks', 'whoChampionsThisApproach', 'whyOurApproachIsSuperior', 'perceivedBenefits', 'hiddenCostsAndPitfalls', 'customFields']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '[]');
		}
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/alternative/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
