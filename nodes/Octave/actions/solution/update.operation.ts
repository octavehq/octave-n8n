import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Solution OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'OId of the solution to update',
	},
	{
		displayName: 'Data (JSON)',
		name: 'data',
		type: 'json',
		required: true,
		default: '{}',
		description: 'Solution data fields to update (name, internalName, description, qualifyingQuestions, data: {summary, distinctCapabilities, keyComponents, customerBenefits, challengesAddressed, statusQuo, differentiatedValue, customFields})',
		typeOptions: { rows: 10 },
	},
];

const displayOptions = {
	show: {
		resource: ['solution'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}
	const data = parseJsonParameter.call(this, 'data', itemIndex, '{}');

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/solution/update', { oId, data });

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
