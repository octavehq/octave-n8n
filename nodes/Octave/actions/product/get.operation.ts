import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Product OID',
        name: 'productOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the product to retrieve',
    },
];

const displayOptions = {
    show: {
        resource: ['product'],
        operation: ['get'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const productOId = this.getNodeParameter('productOId', itemIndex) as string;

    if (!productOId) {
        throw new NodeOperationError(this.getNode(), 'Product OId is required for Get operation.', { itemIndex });
    }

    const qs = { oId: productOId };
    const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/product/get', {}, qs);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]), // Assuming responseData is the product object
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}