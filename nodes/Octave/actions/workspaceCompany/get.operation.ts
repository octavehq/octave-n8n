import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [];

const displayOptions = {
	show: {
		resource: ['workspaceCompany'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/workspace-company/get');

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
