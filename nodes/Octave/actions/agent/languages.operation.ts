import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';

export const exportedProperties: INodeProperties[] = [];

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const response = await octaveApiRequest.call(this, 'GET', '/api/v2/agents/languages');
	return [this.helpers.returnJsonArray(response)];
}
