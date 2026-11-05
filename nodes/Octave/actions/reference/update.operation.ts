import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Reference OId',
        name: 'oId',
        type: 'string',
        required: true,
        default: '',
        description: 'OId of the reference to update',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the reference (optional)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the reference (optional)',
    },
    {
        displayName: 'Internal Name',
        name: 'internalName',
        type: 'string',
        default: '',
        description: 'Internal name of the reference (optional)',
    },
    {
        displayName: 'Business Model',
        name: 'businessModel',
        type: 'string',
        default: '',
        description: 'How the customer operates commercially: revenue model, pricing structure, sales motion, and commercial dynamics (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Their Challenge',
        name: 'theirChallenge',
        type: 'string',
        default: '',
        description: 'What was broken before they came to us — the pain, what they had tried that did not work, and what triggered them to look for a better way (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'How They Use Us',
        name: 'howTheyUseUs',
        type: 'string',
        default: '',
        description: 'What they use us for in practice — which offerings they have adopted, how they have embedded them into their workflows, and the role we now play (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Why They Chose Us',
        name: 'whyTheyChoseUs',
        type: 'string',
        default: '',
        description: 'The decision rationale: alternatives they considered, what made our offering stand out, and the specific factors that tipped them toward us (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Impact They Saw (JSON Array)',
        name: 'impactTheySaw',
        type: 'json',
        default: '[]',
        description: 'JSON array — the meaningful change attributable to working with us: qualitative shifts and quantifiable metrics (optional)',
        typeOptions: { rows: 3 },
    },
    {
        displayName: 'Stakeholders Involved (JSON Array)',
        name: 'stakeholdersInvolved',
        type: 'json',
        default: '[]',
        description: 'JSON array — roles, titles, and personas at the customer who drove and championed the work, and why they cared about this problem (optional)',
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
        resource: ['reference'],
        operation: ['update'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.oId = this.getNodeParameter('oId', itemIndex) as string;
    if (!body.oId) {
        throw new NodeOperationError(this.getNode(), 'Reference OId is required to update a reference.', { itemIndex });
    }

    body.name = this.getNodeParameter('name', itemIndex) as string | undefined;
    body.description = this.getNodeParameter('description', itemIndex) as string | undefined;
    body.internalName = this.getNodeParameter('internalName', itemIndex) as string | undefined;
    body.businessModel = this.getNodeParameter('businessModel', itemIndex) as string | undefined;
    body.theirChallenge = this.getNodeParameter('theirChallenge', itemIndex) as string | undefined;
    body.howTheyUseUs = this.getNodeParameter('howTheyUseUs', itemIndex) as string | undefined;
    body.whyTheyChoseUs = this.getNodeParameter('whyTheyChoseUs', itemIndex) as string | undefined;
    body.impactTheySaw = parseJsonParameter.call(this, 'impactTheySaw', itemIndex, '[]');
    body.stakeholdersInvolved = parseJsonParameter.call(this, 'stakeholdersInvolved', itemIndex, '[]');
    body.customFields = parseJsonParameter.call(this, 'customFields', itemIndex, '[]');

    Object.keys(body).forEach(key => (body[key] === undefined || body[key] === '') && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/reference/update', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}
