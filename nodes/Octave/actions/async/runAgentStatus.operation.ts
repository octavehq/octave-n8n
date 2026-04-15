import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		description: 'The request ID returned by the async agent run',
	},
];

const displayOptions = {
	show: {
		resource: ['async'],
		operation: ['runAgentStatus'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const requestId = this.getNodeParameter('requestId', itemIndex) as string;
	if (!requestId) {
		throw new NodeOperationError(this.getNode(), 'Request ID is required.', { itemIndex });
	}

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/async/agent/run/status', {}, { requestId });
	return [this.helpers.returnJsonArray(response)];
}
