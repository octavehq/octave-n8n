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
        description: 'The URL that Octave will call back upon completion of the email generation',
        placeholder: 'https://example.com/webhook/octave-email-callback'
    },
    {
        displayName: 'Agent OID (Email Agent)',
        name: 'agentOId',
        type: 'string',
        required: true,
        default: '',
        description: 'The OId of the email agent to use for asynchronous generation',
    },
    {
        displayName: 'Email Generation Inputs (JSON Format)',
        name: 'emailInputsJson',
        type: 'json',
        default: '{}',
        description: 'JSON object containing inputs for email generation (e.g., email, firstName, companyName, etc.)',
        placeholder: '{\n    "email": "target@example.com",\n    "firstName": "John",\n    "companyName": "Acme Corp"\n}',
    },
];

const displayOptions = {
    show: {
        resource: ['async'],
        operation: ['generateHeadlessEmails'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const callbackUrl = this.getNodeParameter('callbackUrl', itemIndex) as string;
    const agentOId = this.getNodeParameter('agentOId', itemIndex) as string;

    if (!callbackUrl || !agentOId) {
        throw new NodeOperationError(this.getNode(), 'Callback URL and Agent OId are required for async email generation.', { itemIndex });
    }

    const inputs = parseJsonParameter.call(this, 'emailInputsJson', itemIndex, '{}');

    const body = {
        callbackUrl,
        agentOId,
        inputs,
    };

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/async/headless/generate-emails', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}