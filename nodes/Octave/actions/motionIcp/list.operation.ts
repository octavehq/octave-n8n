import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion OId',
		name: 'motionOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the motion to list ICP cells for',
	},
	{
		displayName: 'Motion Playbook OId',
		name: 'motionPlaybookOId',
		type: 'string',
		default: '',
		description: 'Filter by motion playbook OId (optional)',
	},
];

const displayOptions = {
	show: {
		resource: ['motionIcp'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const motionOId = this.getNodeParameter('motionOId', itemIndex) as string;
	if (!motionOId) {
		throw new NodeOperationError(this.getNode(), 'Motion OId is required.', { itemIndex });
	}
	const motionPlaybookOId = this.getNodeParameter('motionPlaybookOId', itemIndex) as string;

	const qs: any = { motionOId };
	if (motionPlaybookOId) qs.motionPlaybookOId = motionPlaybookOId;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/motion-icp/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
