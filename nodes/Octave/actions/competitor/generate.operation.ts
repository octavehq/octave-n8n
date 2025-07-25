import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Primary Offering OId',
        name: 'primaryOfferingOId',
        type: 'string',
        required: true,
        default: '',
        description: 'Primary offering OId to associate with generated competitors',
    },
    {
        displayName: 'Competitors (JSON)',
        name: 'competitors',
        type: 'json',
        required: true,
        default: '[]',
        description: 'JSON configuration for generating competitors',
        typeOptions: { rows: 10 }
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
        resource: ['competitor'],
        operation: ['generate'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
    if (!body.primaryOfferingOId) {
        throw new NodeOperationError(this.getNode(), 'Primary Offering OId is required to generate competitors.', { itemIndex });
    }

    body.competitors = parseJsonParameter.call(this, 'competitors', itemIndex, '[]');
    body.linkingStrategy = parseJsonParameter.call(this, 'linkingStrategy', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/competitors/generate', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}