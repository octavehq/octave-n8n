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
        displayName: 'URL for Content Generation',
        name: 'urlForContent', // Corresponds to 'url' in API
        type: 'string',
        default: '',
        description: 'URL to use as a basis for content generation (optional)',
    },
    {
        displayName: 'Company Domain',
        name: 'companyDomain',
        type: 'string',
        default: '',
        description: 'Company domain (e.g., example.com) (optional)',
    },
    {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'Name of the company (optional)',
    },
    {
        displayName: 'LinkedIn Profile URL',
        name: 'linkedInProfile',
        type: 'string',
        default: '',
        description: 'LinkedIn profile URL of a relevant person (optional)',
        hint: 'LinkedIn profile is the preferred input method over email for better enrichment results'
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'First name of a relevant person (optional)',
    },
    {
        displayName: 'Job Title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job title of a relevant person (optional)',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'name@example.com',
        description: 'Email address of a relevant person (optional)',
    },
    {
        displayName: 'Runtime Context (JSON)',
        name: 'runtimeContext',
        type: 'json',
        default: '{}',
        description: 'Additional JSON context (optional)',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['generateContent'],
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
    body.email = this.getNodeParameter('email', itemIndex) as string | undefined;
    body.jobTitle = this.getNodeParameter('jobTitle', itemIndex) as string | undefined;
    body.firstName = this.getNodeParameter('firstName', itemIndex) as string | undefined;
    body.linkedInProfile = this.getNodeParameter('linkedInProfile', itemIndex) as string | undefined;
    body.url = this.getNodeParameter('urlForContent', itemIndex) as string | undefined; // Specific to generateContent

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/generate-content/run', body);

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