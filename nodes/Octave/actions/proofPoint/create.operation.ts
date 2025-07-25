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
        description: 'Name of the proof point',
    },
    {
        displayName: 'Primary Offering OId',
        name: 'primaryOfferingOId',
        type: 'string',
        required: true,
        default: '',
        description: 'Primary offering OId to associate with this proof point',
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        required: true,
        default: 'fact',
        options: [
            { name: 'Award', value: 'award' },
            { name: 'Fact', value: 'fact' },
            { name: 'Other', value: 'other' },
            { name: 'Quote', value: 'quote' },
            { name: 'Recognition', value: 'recognition' },
            { name: 'Stat', value: 'stat' },
        ],
        description: 'Type of the proof point',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the proof point (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the proof point (optional)',
    },
    {
        displayName: 'How We Talk About This (JSON Array)',
        name: 'howWeTalkAboutThis',
        type: 'json',
        default: '[]',
        description: 'JSON array of how we talk about this proof point (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Why This Matters (JSON Array)',
        name: 'whyThisMatters',
        type: 'json',
        default: '[]',
        description: 'JSON array of why this proof point matters (optional)',
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
        resource: ['proofPoint'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
    body.type = this.getNodeParameter('type', itemIndex) as string;

    if (!body.name || !body.primaryOfferingOId || !body.type) {
        throw new NodeOperationError(this.getNode(), 'Name, Primary Offering OId, and Type are required to create a proof point.', { itemIndex });
    }

    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.howWeTalkAboutThis = parseJsonParameter.call(this, 'howWeTalkAboutThis', itemIndex, '[]');
    body.whyThisMatters = parseJsonParameter.call(this, 'whyThisMatters', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');
    body.linkingStrategy = parseJsonParameter.call(this, 'linkingStrategy', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/proof-points/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}