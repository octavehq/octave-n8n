import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Persona OID',
        name: 'personaOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the persona to retrieve',
    },
];

const displayOptions = {
    show: {
        resource: ['persona'],
        operation: ['get'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const personaOId = this.getNodeParameter('personaOId', itemIndex) as string;

    if (!personaOId) {
        throw new NodeOperationError(this.getNode(), 'Persona OId is required for Get operation.', { itemIndex });
    }

    const qs = { oId: personaOId };
    const responseData = await octaveApiRequest.call(this, 'GET', '/api/v2/personas/get', {}, qs);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}