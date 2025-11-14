import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    // Workspace Fields
    {
        displayName: 'Workspace: Name',
        name: 'workspaceName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the workspace to be built or configured',
    },
    {
        displayName: 'Workspace: URL',
        name: 'workspaceUrl',
        type: 'string',
        default: '',
        description: 'URL of the workspace (e.g., https://octave.com) (optional)',
    },
    {
        displayName: 'Workspace: Add Existing Users',
        name: 'workspaceAddExistingUsers',
        type: 'boolean',
        default: true,
        description: 'Whether to add existing users to the workspace (optional, defaults to true)',
    },
    {
        displayName: 'Workspace: Agent OIds (JSON Array)',
        name: 'workspaceAgentOIds',
        type: 'json',
        default: '[]',
        description: 'JSON array of Agent OIds to associate (e.g., ["id1", "id2"]) (optional)',
    },
    // Offering Fields
    {
        displayName: 'Offering: Name',
        name: 'offeringName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the offering/product',
    },
    {
        displayName: 'Offering: Differentiated Value',
        name: 'offeringDifferentiatedValue',
        type: 'string',
        required: true,
        default: '',
        description: 'The differentiated value proposition of the offering',
    },
    {
        displayName: 'Offering: Additional URLs (JSON Array)',
        name: 'offeringAdditionalUrls',
        type: 'json',
        default: '[]',
        description: 'JSON array of additional URLs (e.g., ["https://docs.octave.com"]) (optional)',
    },
    {
        displayName: 'Offering: Status Quo',
        name: 'offeringStatusQuo',
        type: 'string',
        default: '',
        description: 'Description of the status quo that the offering addresses (optional)',
    },
    {
        displayName: 'Offering: References (JSON Array of Objects)',
        name: 'offeringReferences',
        type: 'json',
        default: '[]',
        description: 'JSON array of reference objects, e.g., [{ "URL": "string", "details": "string" }] (optional)',
        placeholder: '[{\n    "url": "https://casestudy.example.com/customer-a",\n    "details": "Customer A achieved X results..."\n}]',
    },
    // Runtime Context
    {
        displayName: 'Runtime Context',
        name: 'buildWorkspaceRuntimeContext',
        type: 'string',
        default: '',
        description: 'Additional context as a string (optional)',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['buildWorkspace'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    // This operation does not use agentOId in the path or body. runtimeContext is specific.

    const workspace: Record<string, any> = {
        name: this.getNodeParameter('workspaceName', itemIndex, '') as string,
    };
    const workspaceUrl = this.getNodeParameter('workspaceUrl', itemIndex) as string | undefined;
    if (workspaceUrl) workspace.url = workspaceUrl;
    workspace.addExistingUsers = this.getNodeParameter('workspaceAddExistingUsers', itemIndex, true) as boolean;
    workspace.agentOIds = parseJsonParameter.call(this, 'workspaceAgentOIds', itemIndex, '[]');

    const offering: Record<string, any> = {
        name: this.getNodeParameter('offeringName', itemIndex, '') as string,
        differentiatedValue: this.getNodeParameter('offeringDifferentiatedValue', itemIndex, '') as string,
    };
    offering.additionalUrls = parseJsonParameter.call(this, 'offeringAdditionalUrls', itemIndex, '[]');
    const offeringStatusQuo = this.getNodeParameter('offeringStatusQuo', itemIndex) as string | undefined;
    if (offeringStatusQuo) offering.statusQuo = offeringStatusQuo;
    offering.references = parseJsonParameter.call(this, 'offeringReferences', itemIndex, '[]');

    body.workspace = workspace;
    body.offering = offering;

    const buildWorkspaceRuntimeContext = this.getNodeParameter('buildWorkspaceRuntimeContext', itemIndex, '') as string;
    if (buildWorkspaceRuntimeContext && buildWorkspaceRuntimeContext.trim() !== '') {
        body.runtimeContext = buildWorkspaceRuntimeContext;
    }

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);
    // Clean nested objects too
    Object.keys(workspace).forEach(key => (workspace[key] === undefined) && delete workspace[key]);
    Object.keys(offering).forEach(key => (offering[key] === undefined) && delete offering[key]);

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/workspace/build', body);

    // Preserve both data and _metadata
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