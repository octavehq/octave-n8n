import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Revision OId',
		name: 'revisionOId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the revision to retrieve',
	},
	{
		displayName: 'Diff Only',
		name: 'diffOnly',
		type: 'boolean',
		default: false,
		description: 'Whether to return only the diff',
	},
];

const displayOptions = {
	show: {
		resource: ['revision'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const revisionOId = this.getNodeParameter('revisionOId', itemIndex) as string;
	if (!revisionOId) {
		throw new NodeOperationError(this.getNode(), 'Revision OId is required.', { itemIndex });
	}

	const qs: any = { revisionOId };
	if (this.getNodeParameter('diffOnly', itemIndex) as boolean) qs.diffOnly = true;

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/revision/get', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
