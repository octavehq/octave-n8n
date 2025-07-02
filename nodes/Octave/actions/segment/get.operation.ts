import {
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';

export const exportedProperties: INodeProperties[] = [
	{
		displayName: 'Segment OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the segment to retrieve',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['get'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'octaveApi', {
		method: 'GET',
		url: `/api/v2/segment/get`,
		qs: {
			oId,
		},
	});

	return [this.helpers.returnJsonArray(response)];
}