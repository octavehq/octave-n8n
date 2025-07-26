import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Reference OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the reference to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the reference (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the reference (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the reference (optional)',
    },
    {
        displayName: 'How We Impacted Their Business (JSON Array)',
        name: 'howWeImpactedTheirBusiness',
        type: 'json',
        default: '[]',
        description: 'JSON array of how we impacted their business (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'How They Benefit From Product',
        name: 'howTheyBenefitFromProduct',
        type: 'string',
        default: '',
        description: 'How they benefit from the product (optional)',
    },
    {
        displayName: 'How They Make Money',
        name: 'howTheyMakeMoney',
        type: 'string',
        default: '',
        description: 'How they make money (optional)',
    },
    {
        displayName: 'How They Use Product',
        name: 'howTheyUseProduct',
        type: 'string',
        default: '',
        description: 'How they use the product (optional)',
    },
    {
        displayName: 'Key Stats (JSON Array)',
        name: 'keyStats',
        type: 'json',
        default: '[]',
        description: 'JSON array of key statistics (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Email Snippets (JSON Array)',
        name: 'emailSnippets',
        type: 'json',
        default: '[]',
        description: 'JSON array of email snippets (optional)',
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
        resource: ['reference'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Reference OId is required to update a reference.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.howWeImpactedTheirBusiness = parseJsonParameter.call(this, 'howWeImpactedTheirBusiness', itemIndex, '[]');
    body.howTheyBenefitFromProduct = this.getNodeParameter('howTheyBenefitFromProduct', itemIndex) as string | undefined;
    body.howTheyMakeMoney = this.getNodeParameter('howTheyMakeMoney', itemIndex) as string | undefined;
    body.howTheyUseProduct = this.getNodeParameter('howTheyUseProduct', itemIndex) as string | undefined;
    body.keyStats = parseJsonParameter.call(this, 'keyStats', itemIndex, '[]');
    body.emailSnippets = parseJsonParameter.call(this, 'emailSnippets', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'PUT', '/api/v2/reference/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}