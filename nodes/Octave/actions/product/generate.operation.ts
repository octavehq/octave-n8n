import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Status Quo Input',
        name: 'statusQuoInput',
        type: 'string',
        required: true,
        default: '',
        description: 'Input describing the current status quo for generating the product',
    },
    {
        displayName: 'Differentiated Value Input',
        name: 'differentiatedValueInput',
        type: 'string',
        default: '',
        description: 'Input describing the differentiated value for generating the product (optional)',
    },
    {
        displayName: 'Products (JSON)',
        name: 'products',
        type: 'json',
        required: true,
        default: '{}',
        description: 'JSON configuration for generating products',
        typeOptions: { rows: 10 }
    },
];

const displayOptions = {
    show: {
        resource: ['product'],
        operation: ['generate'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.statusQuoInput = this.getNodeParameter('statusQuoInput', itemIndex) as string;
    if (!body.statusQuoInput) {
        throw new NodeOperationError(this.getNode(), 'Status Quo Input is required to generate products.', { itemIndex });
    }

    body.differentiatedValueInput = this.getNodeParameter('differentiatedValueInput', itemIndex) as string | undefined;
    body.products = parseJsonParameter.call(this, 'products', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/product/generate', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}