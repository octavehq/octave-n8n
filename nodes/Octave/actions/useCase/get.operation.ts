import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Use Case OID',
        name: 'useCaseOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the use case to retrieve',
    },
];

const displayOptions = {
    show: {
        resource: ['useCase'],
        operation: ['get'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const useCaseOId = this.getNodeParameter('useCaseOId', itemIndex) as string;

    if (!useCaseOId) {
        throw new NodeOperationError(this.getNode(), 'Use Case OId is required for Get operation.', { itemIndex });
    }

    const qs = { oId: useCaseOId };
    const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/use-cases/get', {}, qs);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}