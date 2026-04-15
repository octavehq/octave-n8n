import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Brand Voice OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'Brand Voice OId to toggle as default',
	},
];

const displayOptions = {
	show: {
		resource: ['brandVoice'],
		operation: ['toggleDefault'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'Brand Voice OId is required.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/brand-voice/toggle-default', { oId });

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
