import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Resource OIds',
		name: 'oIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Single OId, or comma-separated list of OIds to delete',
	},
];

const displayOptions = {
	show: {
		resource: ['resource'],
		operation: ['delete'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const raw = this.getNodeParameter('oIds', itemIndex) as string;
	if (!raw) {
		throw new NodeOperationError(this.getNode(), 'At least one OId is required.', { itemIndex });
	}

	const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
	const body: Record<string, any> = parts.length === 1 ? { oId: parts[0] } : { oIds: parts };

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/resource/delete', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
