import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Workflow OId',
		name: 'workflowOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the workflow to run',
	},
	{
		displayName: 'Callback URL',
		name: 'callbackUrl',
		type: 'string',
		default: '',
		description: 'Optional callback URL. If provided, results are POSTed to this URL on completion.',
		placeholder: 'https://example.com/webhook/octave-workflow',
	},
];

const displayOptions = {
	show: {
		resource: ['workflow'],
		operation: ['run'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const workflowOId = this.getNodeParameter('workflowOId', itemIndex) as string;
	if (!workflowOId) {
		throw new NodeOperationError(this.getNode(), 'Workflow OId is required.', { itemIndex });
	}

	const body: Record<string, any> = { workflowOId };

	const callbackUrl = this.getNodeParameter('callbackUrl', itemIndex) as string;
	if (callbackUrl) body.callbackUrl = callbackUrl;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/workflows/run', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
