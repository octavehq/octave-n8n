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
		description: 'Motion playbook name',
	},
	{
		displayName: 'Offering OId',
		name: 'offeringOId',
		type: 'string',
		required: true,
		default: '',
		description: 'Offering OId this playbook belongs to',
	},
	{
		displayName: 'Motion Type',
		name: 'motionType',
		type: 'options',
		options: [
			{ name: 'Convert Free to Paid', value: 'CONVERT_FREE_TO_PAID' },
			{ name: 'Cross Sell', value: 'CROSS_SELL' },
			{ name: 'Displace Incumbent', value: 'DISPLACE_INCUMBENT' },
			{ name: 'Net New', value: 'NET_NEW' },
			{ name: 'Renew and Retain', value: 'RENEW_AND_RETAIN' },
			{ name: 'Upsell', value: 'UPSELL' },
		],
		default: 'NET_NEW',
		description: 'Motion type for this playbook',
	},
	{
		displayName: 'Narrative Type',
		name: 'narrativeType',
		type: 'options',
		options: [
			{ name: 'Account', value: 'ACCOUNT' },
			{ name: 'Competitive', value: 'COMPETITIVE' },
			{ name: 'Custom', value: 'CUSTOM' },
			{ name: 'Geo', value: 'GEO' },
			{ name: 'Milestone', value: 'MILESTONE' },
			{ name: 'Thematic', value: 'THEMATIC' },
		],
		default: 'THEMATIC',
		description: 'The narrative type driving this playbook',
	},
	{
		displayName: 'Narrative Input',
		name: 'narrativeInput',
		type: 'string',
		required: true,
		default: '',
		description: 'Narrative input text for the playbook',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Competitor OIds',
		name: 'competitorOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of competitor OIds (used with Competitive narrative, optional)',
	},
	{
		displayName: 'Account Domain',
		name: 'accountDomain',
		type: 'string',
		default: '',
		description: 'Account domain (used with Account narrative, optional)',
	},
	{
		displayName: 'Buying Trigger OId',
		name: 'buyingTriggerOId',
		type: 'string',
		default: '',
		description: 'Buying trigger OId (optional)',
	},
	{
		displayName: 'Scope (JSON)',
		name: 'scope',
		type: 'json',
		default: '{"icpScopeMode":"AUTO","allSegments":true,"segmentOIds":[],"allPersonas":true,"personaOIds":[]}',
		description: 'ICP scope as JSON: {"icpScopeMode": "AUTO"|"MANUAL", "allSegments": bool, "segmentOIds": [], "allPersonas": bool, "personaOIds": []}',
		typeOptions: { rows: 4 },
	},
	{
		displayName: 'Anchor Overrides (JSON)',
		name: 'anchorOverrides',
		type: 'json',
		default: '{"useCases":{"mode":"AUTO","oIds":[]},"references":{"mode":"AUTO","oIds":[]},"proofPoints":{"mode":"AUTO","oIds":[]}}',
		description: 'Anchor overrides as JSON. Each anchor is {"mode": "AUTO"|"MANUAL"|"OFF", "oIds": []}. Supported anchors: useCases, references, proofPoints, alternatives, buyingTriggers, coreFeatures, objections.',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Additional Context',
		name: 'additionalContext',
		type: 'string',
		default: '',
		description: 'Additional context text (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Additional Context Sources (JSON Array)',
		name: 'additionalContextSources',
		type: 'json',
		default: '',
		description: 'JSON array of sources: [{"type": "TEXT"|"URL"|..., "value": "..."}] (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Brand Voice OId',
		name: 'brandVoiceOId',
		type: 'string',
		default: '',
		description: 'Brand voice OId to apply (optional)',
	},
	{
		displayName: 'Enable Learnings',
		name: 'enableLearnings',
		type: 'boolean',
		default: false,
		description: 'Whether to enable learnings for this playbook',
	},
];

const displayOptions = {
	show: {
		resource: ['motionPlaybook'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.name = this.getNodeParameter('name', itemIndex) as string;
	if (!body.name) {
		throw new NodeOperationError(this.getNode(), 'Name is required to create a motion playbook.', { itemIndex });
	}
	body.offeringOId = this.getNodeParameter('offeringOId', itemIndex) as string;
	if (!body.offeringOId) {
		throw new NodeOperationError(this.getNode(), 'Offering OId is required to create a motion playbook.', { itemIndex });
	}
	body.motionType = this.getNodeParameter('motionType', itemIndex) as string;
	body.narrativeType = this.getNodeParameter('narrativeType', itemIndex) as string;
	body.narrativeInput = this.getNodeParameter('narrativeInput', itemIndex) as string;
	if (!body.narrativeInput) {
		throw new NodeOperationError(this.getNode(), 'Narrative Input is required to create a motion playbook.', { itemIndex });
	}

	const competitorOIds = this.getNodeParameter('competitorOIds', itemIndex) as string;
	if (competitorOIds) body.competitorOIds = competitorOIds.split(',').map(id => id.trim());
	const accountDomain = this.getNodeParameter('accountDomain', itemIndex) as string;
	if (accountDomain) body.accountDomain = accountDomain;
	const buyingTriggerOId = this.getNodeParameter('buyingTriggerOId', itemIndex) as string;
	if (buyingTriggerOId) body.buyingTriggerOId = buyingTriggerOId;

	body.scope = parseJsonParameter.call(this, 'scope', itemIndex, '{}');
	body.anchorOverrides = parseJsonParameter.call(this, 'anchorOverrides', itemIndex, '{}');

	const additionalContext = this.getNodeParameter('additionalContext', itemIndex) as string;
	if (additionalContext) body.additionalContext = additionalContext;
	const additionalContextSourcesRaw = this.getNodeParameter('additionalContextSources', itemIndex, '') as string;
	if (additionalContextSourcesRaw && additionalContextSourcesRaw.trim() !== '') {
		body.additionalContextSources = parseJsonParameter.call(this, 'additionalContextSources', itemIndex, '[]');
	}
	const brandVoiceOId = this.getNodeParameter('brandVoiceOId', itemIndex) as string;
	if (brandVoiceOId) body.brandVoiceOId = brandVoiceOId;
	const enableLearnings = this.getNodeParameter('enableLearnings', itemIndex) as boolean;
	if (enableLearnings) body.enableLearnings = enableLearnings;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/motion-playbook/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
