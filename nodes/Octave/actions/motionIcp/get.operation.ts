import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion ICP OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the Motion ICP cell to retrieve',
	},
	{
		displayName: 'Include Report',
		name: 'includeReport',
		type: 'boolean',
		default: false,
		description: 'Whether to include the full report in the response',
	},
];

const displayOptions = {
	show: {
		resource: ['motionIcp'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}
	const includeReport = this.getNodeParameter('includeReport', itemIndex) as boolean;

	const qs: any = { oId };
	if (includeReport) qs.includeReport = 'true';

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/motion-icp/get', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
