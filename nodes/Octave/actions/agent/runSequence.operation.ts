import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

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
        description: 'LinkedIn profile URL of the person (optional)',
        hint: 'LinkedIn profile is the preferred input method over email for better enrichment results'
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'First name of the person (optional)',
    },
    {
        displayName: 'Job Title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job title of the person (optional)',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'name@example.com',
        description: 'Email address of the person (optional)',
    },
    {
        displayName: 'Language',
        name: 'lang',
        type: 'string',
        default: '',
        description: 'Language code for the sequence (e.g., en, es) (optional)',
    },
    {
        displayName: 'Output Format',
        name: 'outputFormat',
        type: 'options',
        options: [
            { name: 'Text', value: 'text' },
            { name: 'HTML', value: 'html' },
            { name: 'Markdown', value: 'markdown' },
        ],
        default: 'text',
        description: 'Desired output format (optional)',
    },
    {
        displayName: 'Runtime Context - All Steps',
        name: 'runtimeContextAll',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'Context to apply to all steps in the sequence (optional)',
    },
    {
        displayName: 'Runtime Context - Step 1',
        name: 'runtimeContextStep1',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 1 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 2',
        name: 'runtimeContextStep2',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 2 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 3',
        name: 'runtimeContextStep3',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 3 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 4',
        name: 'runtimeContextStep4',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 4 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 5',
        name: 'runtimeContextStep5',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 5 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 6',
        name: 'runtimeContextStep6',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 6 (optional)',
    },
    {
        displayName: 'Runtime Context - Step 7',
        name: 'runtimeContextStep7',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Context specific to step 7 (optional)',
    },
    {
        displayName: 'Runtime Instructions - All Steps',
        name: 'runtimeInstructionsAll',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'Instructions to apply to all steps in the sequence (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 1',
        name: 'runtimeInstructionsStep1',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 1 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 2',
        name: 'runtimeInstructionsStep2',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 2 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 3',
        name: 'runtimeInstructionsStep3',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 3 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 4',
        name: 'runtimeInstructionsStep4',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 4 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 5',
        name: 'runtimeInstructionsStep5',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 5 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 6',
        name: 'runtimeInstructionsStep6',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 6 (optional)',
    },
    {
        displayName: 'Runtime Instructions - Step 7',
        name: 'runtimeInstructionsStep7',
        type: 'string',
        typeOptions: {
            rows: 2,
        },
        default: '',
        description: 'Instructions specific to step 7 (optional)',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['runSequence'],
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

    // Build runtimeContext object
    const runtimeContext: Record<string, string> = {};

    const runtimeContextAll = this.getNodeParameter('runtimeContextAll', itemIndex, '') as string;
    if (runtimeContextAll && runtimeContextAll.trim() !== '') {
        runtimeContext['all'] = runtimeContextAll;
    }

    for (let i = 1; i <= 7; i++) {
        const stepContext = this.getNodeParameter(`runtimeContextStep${i}`, itemIndex, '') as string;
        if (stepContext && stepContext.trim() !== '') {
            runtimeContext[i.toString()] = stepContext;
        }
    }

    if (Object.keys(runtimeContext).length > 0) {
        body.runtimeContext = runtimeContext;
    }

    // Build runtimeInstructions object
    const runtimeInstructions: Record<string, string> = {};

    const runtimeInstructionsAll = this.getNodeParameter('runtimeInstructionsAll', itemIndex, '') as string;
    if (runtimeInstructionsAll && runtimeInstructionsAll.trim() !== '') {
        runtimeInstructions['all'] = runtimeInstructionsAll;
    }

    for (let i = 1; i <= 7; i++) {
        const stepInstructions = this.getNodeParameter(`runtimeInstructionsStep${i}`, itemIndex, '') as string;
        if (stepInstructions && stepInstructions.trim() !== '') {
            runtimeInstructions[i.toString()] = stepInstructions;
        }
    }

    if (Object.keys(runtimeInstructions).length > 0) {
        body.runtimeInstructions = runtimeInstructions;
    }

    body.companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string | undefined;
    body.companyName = this.getNodeParameter('companyName', itemIndex) as string | undefined;
    body.email = this.getNodeParameter('email', itemIndex) as string | undefined;
    body.jobTitle = this.getNodeParameter('jobTitle', itemIndex) as string | undefined;
    body.firstName = this.getNodeParameter('firstName', itemIndex) as string | undefined;
    body.linkedInProfile = this.getNodeParameter('linkedInProfile', itemIndex) as string | undefined;
    body.lang = this.getNodeParameter('lang', itemIndex) as string | undefined;
    body.outputFormat = this.getNodeParameter('outputFormat', itemIndex, 'text') as string;

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/sequence/run', body);

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