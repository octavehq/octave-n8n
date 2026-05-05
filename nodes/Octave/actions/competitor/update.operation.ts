import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Competitor OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the competitor to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the competitor (optional)',
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
        displayName: 'How They Position (JSON Array)',
        name: 'howTheyPosition',
        type: 'json',
        default: '[]',
        description: 'JSON array — how the competitor positions themselves: their narrative, messaging, and market story; the pitch they take to market (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Our Key Differentiators (JSON Array)',
        name: 'ourKeyDifferentiators',
        type: 'json',
        default: '[]',
        description: 'JSON array — concrete, observable, tactical points of differentiation we lead with against this competitor (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Competitor Strengths (JSON Array)',
        name: 'competitorStrengths',
        type: 'json',
        default: '[]',
        description: 'JSON array — where this competitor genuinely excels (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Competitor Weaknesses (JSON Array)',
        name: 'competitorWeaknesses',
        type: 'json',
        default: '[]',
        description: 'JSON array — where this competitor falls short (optional)',
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
        displayName: 'Reasons We Lose (JSON Array)',
        name: 'reasonsWeLose',
        type: 'json',
        default: '[]',
        description: 'JSON array — deal-level dynamics for why customers might choose them when both are evaluated (optional)',
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
        resource: ['competitor'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Competitor OId is required to update a competitor.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.howTheyPosition = parseJsonParameter.call(this, 'howTheyPosition', itemIndex, '[]');
    body.ourKeyDifferentiators = parseJsonParameter.call(this, 'ourKeyDifferentiators', itemIndex, '[]');
    body.competitorStrengths = parseJsonParameter.call(this, 'competitorStrengths', itemIndex, '[]');
    body.competitorWeaknesses = parseJsonParameter.call(this, 'competitorWeaknesses', itemIndex, '[]');
    body.reasonsWeWin = parseJsonParameter.call(this, 'reasonsWeWin', itemIndex, '[]');
    body.reasonsWeLose = parseJsonParameter.call(this, 'reasonsWeLose', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'PUT', '/api/v2/competitor/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}