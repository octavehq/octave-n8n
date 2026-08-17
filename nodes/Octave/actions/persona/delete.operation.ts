import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Persona OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the persona to delete',
	},
];

const displayOptions = {
	show: {
		resource: ['persona'],
		operation: ['delete'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'DELETE', '/api/v2/persona/delete', {}, { oId });

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
