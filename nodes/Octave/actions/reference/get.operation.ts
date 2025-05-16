import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Reference OID',
        name: 'referenceOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the reference to retrieve',
    },
];

const displayOptions = {
    show: {
        resource: ['reference'],
        operation: ['get'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const referenceOId = this.getNodeParameter('referenceOId', itemIndex) as string;

    if (!referenceOId) {
        throw new NodeOperationError(this.getNode(), 'Reference OId is required for Get operation.', { itemIndex });
    }

    const qs = { oId: referenceOId };
    const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/references/get', {}, qs);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}