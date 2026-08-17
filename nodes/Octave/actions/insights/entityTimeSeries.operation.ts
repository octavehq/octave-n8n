import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const entityTypeOptions = [
	{ name: 'Alternative', value: 'alternative' },
	{ name: 'Buying Trigger', value: 'buying_trigger' },
	{ name: 'Competitor', value: 'competitor' },
	{ name: 'Core Feature', value: 'core_feature' },
	{ name: 'Hypothesis', value: 'hypothesis' },
	{ name: 'Motion ICP', value: 'motion_icp' },
	{ name: 'Objection', value: 'objection' },
	{ name: 'Persona', value: 'persona' },
	{ name: 'Playbook', value: 'playbook' },
	{ name: 'Product', value: 'product' },
	{ name: 'Proof Point', value: 'proof_point' },
	{ name: 'Reference', value: 'reference' },
	{ name: 'Segment', value: 'segment' },
	{ name: 'Service', value: 'service' },
	{ name: 'Solution', value: 'solution' },
	{ name: 'Target ICP', value: 'target_icp' },
	{ name: 'Use Case', value: 'use_case' },
];

const properties: INodeProperties[] = [
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'options',
		options: entityTypeOptions,
		default: 'persona',
		description: 'The type of the entity',
	},
	{
		displayName: 'Entity OId',
		name: 'entityOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the entity',
	},
	{
		displayName: 'Period Type',
		name: 'periodType',
		type: 'options',
		options: [
			{ name: 'Default', value: '' },
			{ name: 'Month', value: 'month' },
			{ name: 'Quarter', value: 'quarter' },
			{ name: 'Week', value: 'week' },
		],
		default: '',
		description: 'The period granularity (optional)',
	},
	{
		displayName: 'Period Count',
		name: 'periodCount',
		type: 'number',
		default: 0,
		description: 'Number of periods to include (0 = API default)',
	},
];

const displayOptions = {
	show: {
		resource: ['insights'],
		operation: ['entityTimeSeries'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const entityType = this.getNodeParameter('entityType', itemIndex) as string;
	const entityOId = this.getNodeParameter('entityOId', itemIndex) as string;
	if (!entityOId) {
		throw new NodeOperationError(this.getNode(), 'Entity OId is required.', { itemIndex });
	}

	const qs: any = { entityType, entityOId };
	const periodType = this.getNodeParameter('periodType', itemIndex) as string;
	if (periodType) qs.periodType = periodType;
	const periodCount = this.getNodeParameter('periodCount', itemIndex) as number;
	if (periodCount) qs.periodCount = periodCount;

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/insights/entity-time-series', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
