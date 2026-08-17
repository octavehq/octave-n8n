import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Period Type',
		name: 'periodType',
		type: 'options',
		options: [
			{ name: 'Month', value: 'month' },
			{ name: 'Quarter', value: 'quarter' },
			{ name: 'Week', value: 'week' },
		],
		default: 'month',
		description: 'The period granularity',
	},
	{
		displayName: 'Period Start',
		name: 'periodStart',
		type: 'string',
		required: true,
		default: '',
		description: 'Start of the period (ISO date, e.g. 2026-08-01)',
	},
];

const displayOptions = {
	show: {
		resource: ['insights'],
		operation: ['libraryHealth'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const periodType = this.getNodeParameter('periodType', itemIndex) as string;
	const periodStart = this.getNodeParameter('periodStart', itemIndex) as string;
	if (!periodStart) {
		throw new NodeOperationError(this.getNode(), 'Period Start is required.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/insights/library-health', {}, { periodType, periodStart });

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
