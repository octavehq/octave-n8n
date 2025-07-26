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
        displayName: 'Fit Explanation',
        name: 'fitExplanation',
        type: 'string',
        default: '',
        description: 'Explanation of the fit for this segment (optional)',
    },
    {
        displayName: 'Key Considerations (JSON Array)',
        name: 'keyConsiderations',
        type: 'json',
        default: '[]',
        description: 'JSON array of key considerations (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Key Priorities (JSON Array)',
        name: 'keyPriorities',
        type: 'json',
        default: '[]',
        description: 'JSON array of key priorities (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Unique Approach (JSON Array)',
        name: 'uniqueApproach',
        type: 'json',
        default: '[]',
        description: 'JSON array of unique approach elements (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Firmographics (JSON)',
        name: 'firmographics',
        type: 'json',
        default: '{}',
        description: 'Firmographics data (optional)',
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
    body.fitExplanation = this.getNodeParameter('fitExplanation', itemIndex) as string | undefined;
    body.keyConsiderations = parseJsonParameter.call(this, 'keyConsiderations', itemIndex, '[]');
    body.keyPriorities = parseJsonParameter.call(this, 'keyPriorities', itemIndex, '[]');
    body.uniqueApproach = parseJsonParameter.call(this, 'uniqueApproach', itemIndex, '[]');
    body.firmographics = parseJsonParameter.call(this, 'firmographics', itemIndex, '{}');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'PUT', '/api/v2/segment/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}