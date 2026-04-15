import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

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
        displayName: 'Runtime Context',
        name: 'runtimeContext',
        type: 'string',
        default: '',
        description: 'Additional context as a string (optional)',
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

    const runtimeContext = this.getNodeParameter('runtimeContext', itemIndex, '') as string;
    if (runtimeContext && runtimeContext.trim() !== '') {
        body.runtimeContext = runtimeContext;
    }

    body.companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string | undefined;
    body.companyName = this.getNodeParameter('companyName', itemIndex) as string | undefined;

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/enrich-company/run', body);

    // Preserve both data and _metadata with fallback for responses without .data property
    const responseWithMetadata = {
        data: responseDataOuter?.data !== undefined ? responseDataOuter.data : responseDataOuter,
        _metadata: responseDataOuter?._metadata
    };

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseWithMetadata),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}