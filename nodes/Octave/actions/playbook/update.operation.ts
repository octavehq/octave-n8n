import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Playbook OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the playbook to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the playbook (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the playbook (optional)',
    },
    {
        displayName: 'Key Insight (JSON Array)',
        name: 'keyInsight',
        type: 'json',
        default: '[]',
        description: 'JSON array of key insights (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Approach Angle (JSON Array)',
        name: 'approachAngle',
        type: 'json',
        default: '[]',
        description: 'JSON array of approach angles (optional)',
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
        displayName: 'Strategic Narrative (JSON Array)',
        name: 'strategicNarrative',
        type: 'json',
        default: '[]',
        description: 'JSON array of strategic narrative points (optional)',
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
        displayName: 'ICP Concerns (JSON Array)',
        name: 'icpConcerns',
        type: 'json',
        default: '[]',
        description: 'JSON array of ICP concerns (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'ICP Priorities (JSON Array)',
        name: 'icpPriorities',
        type: 'json',
        default: '[]',
        description: 'JSON array of ICP priorities (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Explanation',
        name: 'explanation',
        type: 'string',
        default: '',
        description: 'Explanation of the playbook (optional)',
    },
    {
        displayName: 'Example Description',
        name: 'exampleDescription',
        type: 'string',
        default: '',
        description: 'Example description (optional)',
    },
    {
        displayName: 'Example Domains (JSON Array)',
        name: 'exampleDomains',
        type: 'json',
        default: '[]',
        description: 'JSON array of example domains (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Attributes (JSON)',
        name: 'attributes',
        type: 'json',
        default: '{}',
        description: 'Attributes object (optional)',
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
        resource: ['playbook'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Playbook OId is required to update a playbook.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.keyInsight = parseJsonParameter.call(this, 'keyInsight', itemIndex, '[]');
    body.approachAngle = parseJsonParameter.call(this, 'approachAngle', itemIndex, '[]');
    body.differentiatedValue = parseJsonParameter.call(this, 'differentiatedValue', itemIndex, '[]');
    body.strategicNarrative = parseJsonParameter.call(this, 'strategicNarrative', itemIndex, '[]');
    body.statusQuo = parseJsonParameter.call(this, 'statusQuo', itemIndex, '[]');
    body.icpConcerns = parseJsonParameter.call(this, 'icpConcerns', itemIndex, '[]');
    body.icpPriorities = parseJsonParameter.call(this, 'icpPriorities', itemIndex, '[]');
    body.explanation = this.getNodeParameter('explanation', itemIndex) as string | undefined;
    body.exampleDescription = this.getNodeParameter('exampleDescription', itemIndex) as string | undefined;
    body.exampleDomains = parseJsonParameter.call(this, 'exampleDomains', itemIndex, '[]');
    body.attributes = parseJsonParameter.call(this, 'attributes', itemIndex, '{}');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'PUT', '/api/v2/playbook/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}