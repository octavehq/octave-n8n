import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Product OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the product to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the product (optional)',
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
            { name: 'Product', value: 'PRODUCT' },
            { name: 'Service', value: 'SERVICE' },
        ],
        default: 'PRODUCT',
        description: 'Type of the product (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the product (optional)',
    },
    {
        displayName: 'Summary',
        name: 'summary',
        type: 'string',
        default: '',
        description: 'Summary of the product (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the product (optional)',
    },
    {
        displayName: 'Primary URL',
        name: 'primaryUrl',
        type: 'string',
        default: '',
        description: 'Primary URL for the product (optional)',
    },
    {
        displayName: 'Distinct Capabilities (JSON Array)',
        name: 'distinctCapabilities',
        type: 'json',
        default: '[]',
        description: 'JSON array — what the product does at the functional level: outcome-oriented capabilities, not mechanisms (mechanisms live in keyFeatures) (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Key Features (JSON Array)',
        name: 'keyFeatures',
        type: 'json',
        default: '[]',
        description: 'JSON array — specific, named, often branded components of the product worth highlighting; the "how" behind the capabilities (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Challenges Addressed (JSON Array)',
        name: 'challengesAddressed',
        type: 'json',
        default: '[]',
        description: 'JSON array of challenges addressed by the product (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Customer Benefits (JSON Array)',
        name: 'customerBenefits',
        type: 'json',
        default: '[]',
        description: 'JSON array of customer benefits (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Differentiated Value (JSON Array)',
        name: 'differentiatedValue',
        type: 'json',
        default: '[]',
        description: 'JSON array of differentiated value propositions (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Status Quo (JSON Array)',
        name: 'statusQuo',
        type: 'json',
        default: '[]',
        description: 'JSON array of status quo descriptions (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Custom Fields (JSON Array)',
        name: 'customFields',
        type: 'json',
        default: '[]',
        description: 'JSON array of custom fields: [{"title": "field", "value": ["item1", "item2"]}] (optional)',
        typeOptions: { rows: 5 }
    },
];

const displayOptions = {
    show: {
        resource: ['product'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Product OId is required to update a product.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.type = this.getNodeParameter('type', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.summary = this.getNodeParameter('summary', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.primaryUrl = this.getNodeParameter('primaryUrl', itemIndex) as string | undefined;
    body.distinctCapabilities = parseJsonParameter.call(this, 'distinctCapabilities', itemIndex, '[]');
    body.keyFeatures = parseJsonParameter.call(this, 'keyFeatures', itemIndex, '[]');
    body.challengesAddressed = parseJsonParameter.call(this, 'challengesAddressed', itemIndex, '[]');
    body.customerBenefits = parseJsonParameter.call(this, 'customerBenefits', itemIndex, '[]');
    body.differentiatedValue = parseJsonParameter.call(this, 'differentiatedValue', itemIndex, '[]');
    body.statusQuo = parseJsonParameter.call(this, 'statusQuo', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/product/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}