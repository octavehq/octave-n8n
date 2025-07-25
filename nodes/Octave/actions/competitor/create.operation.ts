import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the competitor',
    },
    {
        displayName: 'Primary Offering OId',
        name: 'primaryOfferingOId',
        type: 'string',
        default: '',
        description: 'Primary offering OId to associate with this competitor (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the competitor (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the competitor (optional)',
    },
    {
        displayName: 'Business Model (JSON Array)',
        name: 'businessModel',
        type: 'json',
        default: '[]',
        description: 'JSON array of business model descriptions (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Comparative Strengths (JSON Array)',
        name: 'comparativeStrengths',
        type: 'json',
        default: '[]',
        description: 'JSON array of comparative strengths (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Comparative Weaknesses (JSON Array)',
        name: 'comparativeWeaknesses',
        type: 'json',
        default: '[]',
        description: 'JSON array of comparative weaknesses (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Key Differentiators (JSON Array)',
        name: 'keyDifferentiators',
        type: 'json',
        default: '[]',
        description: 'JSON array of key differentiators (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Reasons We Win (JSON Array)',
        name: 'reasonsWeWin',
        type: 'json',
        default: '[]',
        description: 'JSON array of reasons we win against this competitor (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Customers We Won (JSON Array)',
        name: 'customersWeWon',
        type: 'json',
        default: '[]',
        description: 'JSON array of customers we won from this competitor (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Customers We Switched (JSON Array)',
        name: 'customersWeSwitched',
        type: 'json',
        default: '[]',
        description: 'JSON array of customers we switched to this competitor (optional)',
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
    {
        displayName: 'Linking Strategy (JSON)',
        name: 'linkingStrategy',
        type: 'json',
        default: '{}',
        description: 'Linking strategy configuration (optional)',
        typeOptions: { rows: 3 }
    },
];

const displayOptions = {
    show: {
        resource: ['competitor'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    if (!body.name) {
        throw new NodeOperationError(this.getNode(), 'Name is required to create a competitor.', { itemIndex });
    }

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.businessModel = parseJsonParameter.call(this, 'businessModel', itemIndex, '[]');
    body.comparativeStrengths = parseJsonParameter.call(this, 'comparativeStrengths', itemIndex, '[]');
    body.comparativeWeaknesses = parseJsonParameter.call(this, 'comparativeWeaknesses', itemIndex, '[]');
    body.keyDifferentiators = parseJsonParameter.call(this, 'keyDifferentiators', itemIndex, '[]');
    body.reasonsWeWin = parseJsonParameter.call(this, 'reasonsWeWin', itemIndex, '[]');
    body.customersWeWon = parseJsonParameter.call(this, 'customersWeWon', itemIndex, '[]');
    body.customersWeSwitched = parseJsonParameter.call(this, 'customersWeSwitched', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');
    body.linkingStrategy = parseJsonParameter.call(this, 'linkingStrategy', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/competitors/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}