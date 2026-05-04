import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Persona OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the persona to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the persona (optional)',
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
];

const displayOptions = {
    show: {
        resource: ['persona'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Persona OId is required to update a persona.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
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

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'PUT', '/api/v2/persona/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}