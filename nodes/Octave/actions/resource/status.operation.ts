import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Resource OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'OId of the resource to check status for',
	},
];

const displayOptions = {
	show: {
		resource: ['resource'],
		operation: ['status'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/resource/status', {}, { oId });
	return [this.helpers.returnJsonArray(response)];
}
