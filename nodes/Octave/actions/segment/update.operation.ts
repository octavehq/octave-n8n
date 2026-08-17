import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Segment OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the segment to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the segment (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the segment (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the segment (optional)',
    },
    {
        displayName: 'Strategic Fit (JSON Array)',
        name: 'strategicFit',
        type: 'json',
        default: '[]',
        description: 'JSON array — why this segment matters to us: the fit between what we offer and what they need, and the unique attributes of this segment that align to our offering (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Operating Characteristics (JSON Array)',
        name: 'operatingCharacteristics',
        type: 'json',
        default: '[]',
        description: 'JSON array — internal, qualitative, often inferred traits that distinguish this segment: org structure, maturity, operating model, culture (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Buying Dynamics (JSON Array)',
        name: 'buyingDynamics',
        type: 'json',
        default: '[]',
        description: 'JSON array — how this segment makes and acts on purchasing decisions: what drives evaluation, who is involved, how the process runs, and what signals a likely buyer (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Strategic Priorities (JSON Array)',
        name: 'strategicPriorities',
        type: 'json',
        default: '[]',
        description: 'JSON array of strategic priorities this segment is pursuing (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Market Pressures (JSON Array)',
        name: 'marketPressures',
        type: 'json',
        default: '[]',
        description: 'JSON array of market pressures affecting this segment (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Firmographics (JSON)',
        name: 'firmographics',
        type: 'json',
        default: '{}',
        description: 'Firmographics object: { industry, businessModel, geography, revenue, employees } — supports custom keys (optional)',
        typeOptions: { rows: 3 }
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
        resource: ['segment'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Segment OId is required to update a segment.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.strategicFit = parseJsonParameter.call(this, 'strategicFit', itemIndex, '[]');
    body.operatingCharacteristics = parseJsonParameter.call(this, 'operatingCharacteristics', itemIndex, '[]');
    body.buyingDynamics = parseJsonParameter.call(this, 'buyingDynamics', itemIndex, '[]');
    body.strategicPriorities = parseJsonParameter.call(this, 'strategicPriorities', itemIndex, '[]');
    body.marketPressures = parseJsonParameter.call(this, 'marketPressures', itemIndex, '[]');
    body.firmographics = parseJsonParameter.call(this, 'firmographics', itemIndex, '{}');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/segment/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}
