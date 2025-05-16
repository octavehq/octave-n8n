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
        description: 'Name of the reference',
    },
    {
        displayName: 'Product OID',
        name: 'productOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the product this reference is associated with',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        description: 'Description of the reference',
    },
    {
        displayName: 'Data (JSON Format)',
        name: 'dataJson',
        type: 'json',
        default: '{}',
        description: 'JSON object containing reference data. Refer to Octave API docs for schema.',
        placeholder: '{\n    "howTheyMakeMoney": "Example explanation...",\n    "howTheyUseProduct": "Details on product usage...",\n    "howTheyBenefitFromProduct": "Benefits derived...",\n    "emailSnippets": ["Snippet 1", "Snippet 2"],\n    "customFields": [{ \"title\": \"Custom Field Name\", \"value\": [\"Value1\"] }]\n}',
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
    body.productOId = this.getNodeParameter('productOId', itemIndex) as string;

    if (!body.name || !body.productOId) {
        throw new NodeOperationError(this.getNode(), 'Name and Product OId are required for creating a reference.', { itemIndex });
    }

    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.data = parseJsonParameter.call(this, 'dataJson', itemIndex, '{}'); // API might expect 'data' not 'dataJson'

    Object.keys(body).forEach(key => (body[key] === undefined || (typeof body[key] === 'object' && Object.keys(body[key]).length === 0 && key === 'data')) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/references/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}