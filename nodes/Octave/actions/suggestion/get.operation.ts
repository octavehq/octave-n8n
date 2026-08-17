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
		description: 'The OId of the suggestion to retrieve',
	},
	{
		displayName: 'Include Preview',
		name: 'includePreview',
		type: 'boolean',
		default: false,
		description: 'Whether to include the proposed entity preview',
	},
	{
		displayName: 'Include Evidence',
		name: 'includeEvidence',
		type: 'boolean',
		default: false,
		description: 'Whether to include supporting evidence',
	},
];

const displayOptions = {
	show: {
		resource: ['suggestion'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}

	const qs: any = { oId };
	if (this.getNodeParameter('includePreview', itemIndex) as boolean) qs.includePreview = true;
	if (this.getNodeParameter('includeEvidence', itemIndex) as boolean) qs.includeEvidence = true;

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/suggestion/get', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
