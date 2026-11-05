import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Anchor At',
		name: 'anchorAt',
		type: 'string',
		default: '',
		description: 'Anchor date (ISO format, optional)',
	},
];

const displayOptions = {
	show: {
		resource: ['insights'],
		operation: ['workspaceBaseline'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const qs: any = {};
	const anchorAt = this.getNodeParameter('anchorAt', itemIndex) as string;
	if (anchorAt) qs.anchorAt = anchorAt;

	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/insights/workspace-baseline', {}, qs);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
