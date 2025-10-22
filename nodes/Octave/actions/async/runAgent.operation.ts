import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Callback URL',
        name: 'callbackUrl',
        type: 'string',
        required: true,
        default: '',
        description: 'The URL that Octave will call back upon completion of the asynchronous task',
        placeholder: 'https://example.com/webhook/octave-callback'
    },
    {
        displayName: 'Agent OId',
        name: 'agentOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the agent to run asynchronously',
    },
    {
        displayName: 'Inputs (JSON Format)',
        name: 'inputsJson',
        type: 'json',
        default: '{}',
        description: 'JSON object containing the inputs for the agent run. Structure depends on the agent type (e.g., email, companyDomain, etc.).',
        placeholder: '{\n    "email": "test@example.com",\n    "companyDomain": "example.com"\n}',
    },
];

const displayOptions = {
    show: {
        resource: ['async'],
        operation: ['runAgent'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const callbackUrl = this.getNodeParameter('callbackUrl', itemIndex) as string;
    const agentOId = this.getNodeParameter('agentOId', itemIndex) as string;

    if (!callbackUrl || !agentOId) {
        throw new NodeOperationError(this.getNode(), 'Callback URL and Agent OId are required for async runAgent.', { itemIndex });
    }

    const inputs = parseJsonParameter.call(this, 'inputsJson', itemIndex, '{}');

    const body = {
        callbackUrl,
        agentOId,
        inputs,
    };

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/async/agent/run', body);

    // Async operations have a different response structure than regular agents
    // Async response: { status: "pending", message: "Additional information", requestId: "requestId" }
    // Regular agents: { data: {...}, _metadata: {...} }
    // Use fallback pattern to handle both structures
    const responseWithMetadata = {
        data: responseData?.data !== undefined ? responseData.data : responseData,
        _metadata: responseData?._metadata
    };

    // Async operations usually return a task ID or a message indicating the task has started.
    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseWithMetadata),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}