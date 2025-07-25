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
        description: 'Primary offering OId to associate with generated personas',
    },
    {
        displayName: 'Playbook OId',
        name: 'playbookOId',
        type: 'string',
        default: '',
        description: 'Playbook OId to associate with generated personas (optional)',
    },
    {
        displayName: 'Personas (JSON)',
        name: 'personas',
        type: 'json',
        required: true,
        default: '[]',
        description: 'JSON configuration for generating personas',
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
        resource: ['persona'],
        operation: ['generate'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string;
    if (!body.primaryOfferingOId) {
        throw new NodeOperationError(this.getNode(), 'Primary Offering OId is required to generate personas.', { itemIndex });
    }

    body.playbookOId = this.getNodeParameter('playbookOId', itemIndex) as string | undefined;
    body.personas = parseJsonParameter.call(this, 'personas', itemIndex, '[]');
    body.linkingStrategy = parseJsonParameter.call(this, 'linkingStrategy', itemIndex, '{}');

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/persona/generate', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}