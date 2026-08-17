import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Config OId',
		name: 'configOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the report config to list runs for',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of results to skip',
	},
];

const displayOptions = {
	show: {
		resource: ['reportRun'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const configOId = this.getNodeParameter('configOId', itemIndex) as string;
	if (!configOId) {
		throw new NodeOperationError(this.getNode(), 'Config OId is required.', { itemIndex });
	}

	const qs: any = { configOId };
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	if (limit) qs.limit = limit;
	const offset = this.getNodeParameter('offset', itemIndex) as number;
	if (offset) qs.offset = offset;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/report-run/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
