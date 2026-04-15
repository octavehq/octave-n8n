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
		description: 'The OId of the resource to retrieve',
	},
	{
		displayName: 'Check Storage Task Status',
		name: 'checkStorageTaskStatus',
		type: 'boolean',
		default: false,
		description: 'Whether to also check the async storage task status',
	},
];

const displayOptions = {
	show: {
		resource: ['resource'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	const checkStorageTaskStatus = this.getNodeParameter('checkStorageTaskStatus', itemIndex) as boolean;

	const qs: any = { oId };
	if (checkStorageTaskStatus) qs.checkStorageTaskStatus = true;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/resource/get', {}, qs);
	return [this.helpers.returnJsonArray(response)];
}
