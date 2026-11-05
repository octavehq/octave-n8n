import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Use Case OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the use case to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the use case (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the use case (optional)',
    },
    {
        displayName: 'Summary',
        name: 'summary',
        type: 'string',
        default: '',
        description: 'Summary of the use case (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the use case (optional)',
    },
    {
        displayName: 'Primary URL',
        name: 'primaryUrl',
        type: 'string',
        default: '',
        description: 'Primary URL for the use case (optional)',
    },
    {
        displayName: 'Business Drivers (JSON Array)',
        name: 'businessDrivers',
        type: 'json',
        default: '[]',
        description: 'JSON array of business drivers (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Desired Outcomes (JSON Array)',
        name: 'desiredOutcomes',
        type: 'json',
        default: '[]',
        description: 'JSON array of desired outcomes (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Scenarios (JSON Array)',
        name: 'scenarios',
        type: 'json',
        default: '[]',
        description: 'JSON array of scenarios (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Strategic Impact (JSON Array)',
        name: 'strategicImpact',
        type: 'json',
        default: '[]',
        description: 'JSON array — strategic, business-level benefit realized when this use case is solved well: quantifiable impact on revenue, cost, risk, and/or efficiency, and the broader value to the company (optional)',
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
        resource: ['useCase'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Use Case OId is required to update a use case.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.summary = this.getNodeParameter('summary', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.primaryUrl = this.getNodeParameter('primaryUrl', itemIndex) as string | undefined;
    body.businessDrivers = parseJsonParameter.call(this, 'businessDrivers', itemIndex, '[]');
    body.desiredOutcomes = parseJsonParameter.call(this, 'desiredOutcomes', itemIndex, '[]');
    body.scenarios = parseJsonParameter.call(this, 'scenarios', itemIndex, '[]');
    body.strategicImpact = parseJsonParameter.call(this, 'strategicImpact', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/use-case/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}