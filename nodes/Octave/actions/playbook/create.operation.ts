import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Product OId',
        name: 'productOId',
        type: 'string',
        required: true,
        default: '',
        description: 'Product OId to associate with this playbook',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: true,
        default: '',
        description: 'Description of the playbook',
    },
    {
        displayName: 'Key Insight',
        name: 'keyInsight',
        type: 'string',
        required: true,
        default: '',
        description: 'Key insight of the playbook',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the playbook (optional)',
    },
    {
        displayName: 'Type',
        name: 'playbookTypeCreate', // Maps to 'type' in API
        type: 'options',
        options: [
            { name: 'Account', value: 'ACCOUNT' },
            { name: 'Competitive', value: 'COMPETITIVE' },
            { name: 'Custom', value: 'CUSTOM' },
            { name: 'Milestone', value: 'MILESTONE' },
            { name: 'Practitioner', value: 'PRACTITIONER' },
            { name: 'Sector', value: 'SECTOR' },
            { name: 'Solution', value: 'SOLUTION' },
        ],
        default: 'SOLUTION',
        description: 'Type of the playbook (optional)',
    },
    {
        displayName: 'Context',
        name: 'context',
        type: 'string',
        default: '',
        description: 'Context of the playbook (optional)',
    },
    {
        displayName: 'Persona OIds (JSON Array)',
        name: 'personaOIds',
        type: 'json',
        default: '[]',
        description: 'JSON array of Persona OIds (e.g., ["p_123"]) (optional)',
    },
    {
        displayName: 'Use Case OIds (JSON Array)',
        name: 'useCaseOIds',
        type: 'json',
        default: '[]',
        description: 'JSON array of Use Case OIds (e.g., ["uc_123"]) (optional)',
    },
    {
        displayName: 'Create Templates',
        name: 'createTemplates',
        type: 'boolean',
        default: false,
        description: 'Whether to create templates for the playbook (optional)',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Echo', value: 'ECHO' },
            { name: 'Harmony', value: 'HARMONY' },
            { name: 'Pulse', value: 'PULSE' },
        ],
        default: 'ECHO',
        description: 'Model of the playbook (optional)',
    },
    {
        displayName: 'Additional Context Sources (JSON)',
        name: 'additionalContextSources',
        type: 'json',
        default: '[]',
        description: 'E.g., [{\"type\":\"URL\",\"value\":\"https://example.com\"}] (optional)',
        typeOptions: { rows: 5 }
    },
];

const displayOptions = {
	show: {
		resource: ['playbook'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.productOId = this.getNodeParameter('productOId', itemIndex) as string;
    if (!body.productOId) {
        throw new NodeOperationError(this.getNode(), 'Product OId is required to create a playbook.', { itemIndex });
    }

    body.description = this.getNodeParameter('description', itemIndex, '') as string;
    body.keyInsight = this.getNodeParameter('keyInsight', itemIndex, '') as string;
    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.type = this.getNodeParameter('playbookTypeCreate', itemIndex) as string | undefined;
    body.context = this.getNodeParameter('context', itemIndex) as string | undefined;
    body.personaOIds = parseJsonParameter.call(this, 'personaOIds', itemIndex, '[]');
    body.useCaseOIds = parseJsonParameter.call(this, 'useCaseOIds', itemIndex, '[]');
    body.createTemplates = this.getNodeParameter('createTemplates', itemIndex, false) as boolean;
    body.model = this.getNodeParameter('model', itemIndex) as string | undefined;
    body.additionalContextSources = parseJsonParameter.call(this, 'additionalContextSources', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/playbook/create', body);
    // For CREATE, response is usually the created object itself
    const responseDataInner = responseDataOuter;

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || {}),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}