import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Service OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the service to retrieve',
	},
];

const displayOptions = {
	show: {
		resource: ['service'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/service/get', {}, { oId });
	return [this.helpers.returnJsonArray(response)];
}
