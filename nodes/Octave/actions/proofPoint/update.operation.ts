import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Proof Point OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the proof point to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the proof point (optional)',
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        default: 'fact',
        options: [
            { name: 'Award', value: 'award' },
            { name: 'Fact', value: 'fact' },
            { name: 'Other', value: 'other' },
            { name: 'Quote', value: 'quote' },
            { name: 'Recognition', value: 'recognition' },
            { name: 'Stat', value: 'stat' },
        ],
        description: 'Type of the proof point (optional)',
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
        displayName: 'The Proof (JSON Array)',
        name: 'theProof',
        type: 'json',
        default: '[]',
        description: 'JSON array — the complete evidence statement: the actual fact, statistic, claim, metric, achievement or recognition AND where it comes from and when (if available) (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'What It Supports (JSON Array)',
        name: 'whatItSupports',
        type: 'json',
        default: '[]',
        description: 'JSON array — the specific value claims, differentiators, or message this proof point backs up; what links the proof into the broader value story (optional)',
        typeOptions: { rows: 3 },
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
        displayName: 'Why It Matters (JSON Array)',
        name: 'whyItMatters',
        type: 'json',
        default: '[]',
        description: 'JSON array — the strategic frame for why this proof point is compelling: what objection it neutralizes, what doubt it removes, what conviction it builds (optional)',
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
        resource: ['proofPoint'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Proof Point OId is required to update a proof point.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.type = this.getNodeParameter('type', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.theProof = parseJsonParameter.call(this, 'theProof', itemIndex, '[]');
    body.whatItSupports = parseJsonParameter.call(this, 'whatItSupports', itemIndex, '[]');
    body.howWeTalkAboutThis = parseJsonParameter.call(this, 'howWeTalkAboutThis', itemIndex, '[]');
    body.whyItMatters = parseJsonParameter.call(this, 'whyItMatters', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/proof-point/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}