import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Job OId',
		name: 'jobOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the workflow run job to check',
	},
];

const displayOptions = {
	show: {
		resource: ['workflow'],
		operation: ['runStatus'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const jobOId = this.getNodeParameter('jobOId', itemIndex) as string;
	if (!jobOId) {
		throw new NodeOperationError(this.getNode(), 'Job OId is required.', { itemIndex });
	}

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/workflows/run/status', {}, { jobOId });
	return [this.helpers.returnJsonArray(response)];
}
