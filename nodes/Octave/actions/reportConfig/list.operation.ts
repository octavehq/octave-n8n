import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Group OId',
		name: 'groupOId',
		type: 'string',
		default: '',
		description: 'Filter by report group OId (optional)',
	},
];

const displayOptions = {
	show: {
		resource: ['reportConfig'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const qs: any = {};
	const groupOId = this.getNodeParameter('groupOId', itemIndex) as string;
	if (groupOId) qs.groupOId = groupOId;

	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/report-config/list', {}, qs);
	return [this.helpers.returnJsonArray(response.data || [])];
}
