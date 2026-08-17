import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Suggestion OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the suggestion to reject (only pending suggestions can be rejected)',
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		description: 'Optional reason for rejecting; recording one helps the system improve',
	},
];

const displayOptions = {
	show: {
		resource: ['suggestion'],
		operation: ['reject'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}

	const body: Record<string, any> = { oId };
	const reason = this.getNodeParameter('reason', itemIndex) as string;
	if (reason) body.reason = reason;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/suggestion/reject', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
