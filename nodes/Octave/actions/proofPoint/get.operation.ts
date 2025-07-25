import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Proof Point OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the proof point to retrieve',
    },
];

const displayOptions = {
    show: {
        resource: ['proofPoint'],
        operation: ['get'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!oId) {
        throw new NodeOperationError(this.getNode(), 'Proof Point OId is required.', { itemIndex });
    }

    const responseData = await octaveApiRequest.call(this, 'GET', `/api/v2/proof-points/${oId}`);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}