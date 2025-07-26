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
        description: 'Name of the use case',
    },
    {
        displayName: 'Primary Offering Name or ID',
        name: 'primaryOfferingOId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: '',
        description: 'Primary offering to associate with this use case (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
                description: 'Link to all active products in the workspace'
            },
            {
                name: 'Specific Products',
                value: 'SPECIFIC',
                description: 'Link to specific products only'
            }
        ],
        default: 'ALL',
        description: 'Strategy for linking this use case to products',
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
        resource: ['useCase'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    if (!body.name) {
        throw new NodeOperationError(this.getNode(), 'Name is required to create a use case.', { itemIndex });
    }

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.summary = this.getNodeParameter('summary', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.primaryUrl = this.getNodeParameter('primaryUrl', itemIndex) as string | undefined;
    body.businessDrivers = parseJsonParameter.call(this, 'businessDrivers', itemIndex, '[]');
    body.desiredOutcomes = parseJsonParameter.call(this, 'desiredOutcomes', itemIndex, '[]');
    body.scenarios = parseJsonParameter.call(this, 'scenarios', itemIndex, '[]');
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

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/use-case/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}