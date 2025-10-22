import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Agent OId Name or ID',
        name: 'agentOId',
        type: 'options',
        required: true,
        typeOptions: { loadOptionsMethod: 'getAgents' },
        default: '',
        description: 'The OId of the agent to run. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Company Domain',
        name: 'companyDomain',
        type: 'string',
        required: true,
        default: '',
        description: 'The domain of the company to qualify (e.g., example.com)',
    },
    {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'The name of the company (optional)',
    },
    {
        displayName: 'Runtime Context (JSON)',
        name: 'runtimeContext',
        type: 'json',
        default: '{}',
        description: 'Additional JSON context (optional)',
    },
    {
        displayName: 'Additional Inputs (JSON)',
        name: 'additionalInputsJson',
        type: 'json',
        default: '{}',
        description: 'A JSON object for any other inputs the agent might accept (optional)',
        placeholder: '{\n    "qualificationCriteria": "revenue > 10M"\n}',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['qualifyCompany'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    const agentOId = this.getNodeParameter('agentOId', itemIndex) as string | undefined;
    if (!agentOId) {
        throw new NodeOperationError(this.getNode(), 'Agent OId is required for this operation.', { itemIndex });
    }
    body.agentOId = agentOId;

    const runtimeContextString = this.getNodeParameter('runtimeContext', itemIndex, '{}') as string;
    if (runtimeContextString && runtimeContextString.trim() !== '{}' && runtimeContextString.trim() !== '') {
        body.runtimeContext = parseJsonParameter.call(this, 'runtimeContext', itemIndex, '{}');
    }

    const additionalInputs = parseJsonParameter.call(this, 'additionalInputsJson', itemIndex, '{}');

    body.companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string | undefined;
    body.companyName = this.getNodeParameter('companyName', itemIndex) as string | undefined;

    const finalBody = { ...body, ...additionalInputs };

    Object.keys(finalBody).forEach(key => (finalBody[key] === undefined) && delete finalBody[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/qualify-company/run', finalBody);

    // Preserve both data and _metadata
    const responseWithMetadata = {
        data: responseDataOuter?.data,
        _metadata: responseDataOuter?._metadata
    };

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseWithMetadata),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}