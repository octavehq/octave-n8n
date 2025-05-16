import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Agent OId Name or ID',
        name: 'agentOId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getAgents',
        },
        default: '',
        description: 'The OId of the agent to run. Choose from the list, or specify an ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Company Domain',
        name: 'companyDomain',
        type: 'string',
        required: true,
        default: '',
        description: 'The domain of the company to enrich (e.g., example.com)',
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
        description: 'Additional JSON context to pass to the agent at runtime',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['enrichCompany'],
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

    body.companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string | undefined;
    body.companyName = this.getNodeParameter('companyName', itemIndex) as string | undefined;

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/enrich-company/run', body);
    const responseDataInner = responseDataOuter?.data;

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || responseDataOuter || {}),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}