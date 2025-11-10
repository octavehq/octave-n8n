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
        description: 'The external facing name of the reference',
        placeholder: 'Large filesharing service',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'The internal name of the reference (optional)',
        placeholder: 'Dropbox',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        description: 'A description of the reference (optional)',
        placeholder: 'Leading cloud storage and file sharing company',
    },
    {
        displayName: 'Primary Offering Name or ID',
        name: 'primaryOfferingOId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: '',
        description: 'Primary offering to associate with this reference (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        hint: "Primary Offering to use as context when creating reference. If not provided, the primary company attached to the Workspace will be used."
    },
    {
        displayName: 'Data (JSON Format)',
        name: 'dataJson',
        type: 'json',
        default: '{}',
        description: 'JSON object containing reference data (optional). Refer to Octave API docs for schema.',
        placeholder: '{\n  "howTheyMakeMoney": "Subscription-based cloud storage...",\n  "howTheyUseProduct": "Uses our API for integration...",\n  "howTheyBenefitFromProduct": "Improved reliability...",\n  "howWeImpactedTheirBusiness": ["50% cost reduction", "99.9% uptime"],\n  "keyStats": ["100M+ users", "$2B ARR"],\n  "customFields": [{ "title": "Industry", "value": ["SaaS", "Cloud Storage"] }]\n}',
        typeOptions: {
            rows: 8,
        },
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
        description: 'Strategy for linking this reference to products',
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
        resource: ['reference'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    if (!body.name) {
        throw new NodeOperationError(this.getNode(), 'Name is required to create a reference.', { itemIndex });
    }

    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string | undefined;
    body.data = parseJsonParameter.call(this, 'dataJson', itemIndex, '{}');

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

    Object.keys(body).forEach(key => (body[key] === undefined || (typeof body[key] === 'object' && Object.keys(body[key]).length === 0 && key === 'data')) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/reference/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}