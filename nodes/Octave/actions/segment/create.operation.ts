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
        description: 'Name of the segment',
    },
    {
        displayName: 'Primary Offering OId',
        name: 'primaryOfferingOId',
        type: 'string',
        default: '',
        description: 'Primary offering OId to associate with this segment (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the segment (optional)',
    },
    {
        displayName: 'Data (JSON)',
        name: 'data',
        type: 'json',
        default: '{}',
        description: 'Additional data for the segment (optional)',
        typeOptions: { rows: 5 }
    },
    {
        displayName: 'Linking Strategy (JSON)',
        name: 'linkingStrategy',
        type: 'json',
        default: '{}',
        description: 'Linking strategy configuration (optional)',
        typeOptions: { rows: 3 }
    },
];

const displayOptions = {
    show: {
        resource: ['segment'],
        operation: ['create'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.name = this.getNodeParameter('name', itemIndex) as string;
    if (!body.name) {
        throw new NodeOperationError(this.getNode(), 'Name is required to create a segment.', { itemIndex });
    }

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.data = parseJsonParameter.call(this, 'data', itemIndex, '{}');
    body.linkingStrategy = parseJsonParameter.call(this, 'linkingStrategy', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/segments/create', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}