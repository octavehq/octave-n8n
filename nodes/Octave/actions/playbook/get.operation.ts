import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Playbook OId',
        name: 'playbookOIdGet', // Name used in getNodeParameter
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the playbook to retrieve',
    },
];

const displayOptions = {
	show: {
		resource: ['playbook'],
		operation: ['get'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const qs: Record<string, any> = {};

    const playbookOId = this.getNodeParameter('playbookOIdGet', itemIndex) as string;
    if (!playbookOId) {
        throw new NodeOperationError(this.getNode(), 'Playbook OId is required for Get operation.', { itemIndex });
    }
    qs.oId = playbookOId;

    const responseDataOuter = await octaveApiRequest.call(this, 'GET', '/api/v2/playbook/get', {}, qs);
    // For GET by ID, response is usually the object itself, not wrapped in .data
    const responseDataInner = responseDataOuter;

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || {}),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}