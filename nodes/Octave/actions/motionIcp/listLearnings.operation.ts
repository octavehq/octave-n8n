import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion ICP OId',
		name: 'motionIcpOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the Motion ICP cell to list learnings for',
	},
];

const displayOptions = {
	show: {
		resource: ['motionIcp'],
		operation: ['listLearnings'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const motionIcpOId = this.getNodeParameter('motionIcpOId', itemIndex) as string;
	if (!motionIcpOId) {
		throw new NodeOperationError(this.getNode(), 'Motion ICP OId is required.', { itemIndex });
	}

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/motion-icp/learnings/list', {}, { motionIcpOId });
	return [this.helpers.returnJsonArray(response.data || [])];
}
