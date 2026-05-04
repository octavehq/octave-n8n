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
        description: 'Name of the persona',
    },
    {
        displayName: 'Primary Offering Name or ID',
        name: 'primaryOfferingOId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: '',
        description: 'Primary offering to associate with this persona (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the persona (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the persona (optional)',
    },
    {
        displayName: 'Common Job Titles (JSON Array)',
        name: 'commonJobTitles',
        type: 'json',
        default: '[]',
        description: 'JSON array of common job titles for this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Key Concerns (JSON Array)',
        name: 'keyConcerns',
        type: 'json',
        default: '[]',
        description: 'JSON array of key concerns for this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Key Objectives (JSON Array)',
        name: 'keyObjectives',
        type: 'json',
        default: '[]',
        description: 'JSON array of key objectives for this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Pain Points (JSON Array)',
        name: 'painPoints',
        type: 'json',
        default: '[]',
        description: 'JSON array of pain points for this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Primary Responsibilities (JSON Array)',
        name: 'primaryResponsibilities',
        type: 'json',
        default: '[]',
        description: 'JSON array of primary responsibilities for this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Why They Matter To Us (JSON Array)',
        name: 'whyTheyMatterToUs',
        type: 'json',
        default: '[]',
        description: 'JSON array of why this persona matters to us (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Why We Matter To Them (JSON Array)',
        name: 'whyWeMatterToThem',
        type: 'json',
        default: '[]',
        description: 'JSON array of why we matter to this persona (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Buying Role (JSON Array)',
        name: 'buyingRole',
        type: 'json',
        default: '[]',
        description: 'JSON array describing the function this persona plays in a purchase decision (e.g. economic buyer, champion, technical evaluator, end user, influencer, blocker), along with their level of sophistication (newcomer, experienced, expert) (optional)',
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
        displayName: 'Linking Strategy Mode',
        name: 'linkingMode',
        type: 'options',
        options: [
            {
                name: 'All Products',
                value: 'ALL',
                description: 'Link to all active offerings (products/services) in the workspace'
            },
            {
                name: 'Specific Products',
                value: 'SPECIFIC',
                description: 'Link to specific products only'
            }
        ],
        default: 'ALL',
        description: 'Strategy for linking this persona to products',
    },
    {
        displayName: 'Product Names or IDs',
        name: 'offeringOIds',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: [],
        description: 'Products to link to (required when using Specific Products mode). Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
            show: {
                linkingMode: ['SPECIFIC']
            }
        }
    },
];

const displayOptions = {
    show: {
        resource: ['persona'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    if (!body.name) {
        throw new NodeOperationError(this.getNode(), 'Name is required to create a persona.', { itemIndex });
    }

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.commonJobTitles = parseJsonParameter.call(this, 'commonJobTitles', itemIndex, '[]');
    body.keyConcerns = parseJsonParameter.call(this, 'keyConcerns', itemIndex, '[]');
    body.keyObjectives = parseJsonParameter.call(this, 'keyObjectives', itemIndex, '[]');
    body.painPoints = parseJsonParameter.call(this, 'painPoints', itemIndex, '[]');
    body.primaryResponsibilities = parseJsonParameter.call(this, 'primaryResponsibilities', itemIndex, '[]');
    body.whyTheyMatterToUs = parseJsonParameter.call(this, 'whyTheyMatterToUs', itemIndex, '[]');
    body.whyWeMatterToThem = parseJsonParameter.call(this, 'whyWeMatterToThem', itemIndex, '[]');
    body.buyingRole = parseJsonParameter.call(this, 'buyingRole', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');
    // Build linking strategy
    const linkingMode = this.getNodeParameter('linkingMode', itemIndex) as string;
    if (linkingMode === 'ALL') {
        body.linkingStrategy = { mode: 'ALL' };
    } else if (linkingMode === 'SPECIFIC') {
        const offeringOIds = this.getNodeParameter('offeringOIds', itemIndex) as string[];
        if (!offeringOIds || offeringOIds.length === 0) {
            throw new NodeOperationError(this.getNode(), 'Products are required when using Specific Products mode.', { itemIndex });
        }
        body.linkingStrategy = {
            mode: 'SPECIFIC',
            offeringOIds: offeringOIds
        };
    }

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/persona/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}