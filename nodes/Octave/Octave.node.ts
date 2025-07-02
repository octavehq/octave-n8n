import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionType
} from 'n8n-workflow';

import { router } from './actions/router';
// Remove direct import of octaveApiRequestListAll if no longer used here directly
// import { octaveApiRequestListAll } from './transport/OctaveApiRequest';
import { getAgents, getPersonas, getPlaybooks } from './methods/loadOptions';

// Description imports for Operations
import { agentOperations } from './descriptions/AgentDescription';
import { apiKeyOperations } from './descriptions/ApiKeyDescription';
import { asyncOperations } from './descriptions/AsyncDescription';
import { headlessOperations } from './descriptions/HeadlessDescription';
import { personaOperations } from './descriptions/PersonaDescription';
import { playbookOperations } from './descriptions/PlaybookDescription';
import { productOperations } from './descriptions/ProductDescription';
import { referenceOperations } from './descriptions/ReferenceDescription';
import { useCaseOperations } from './descriptions/UseCaseDescription';
import { competitorOperations } from './descriptions/CompetitorDescription';
import { segmentOperations } from './descriptions/SegmentDescription';
import { experimentOperations } from './descriptions/ExperimentDescription';

// Operation Property imports
// Agent
import { exportedProperties as agentBuildWorkspaceProperties } from './actions/agent/buildWorkspace.operation';
import { exportedProperties as agentCallPrepProperties } from './actions/agent/callPrep.operation';
import { exportedProperties as agentEnrichCompanyProperties } from './actions/agent/enrichCompany.operation';
import { exportedProperties as agentEnrichPersonProperties } from './actions/agent/enrichPerson.operation';
import { exportedProperties as agentGenerateContentProperties } from './actions/agent/generateContent.operation';
import { exportedProperties as agentListProperties } from './actions/agent/list.operation';
import { exportedProperties as agentQualifyCompanyProperties } from './actions/agent/qualifyCompany.operation';
import { exportedProperties as agentQualifyPersonProperties } from './actions/agent/qualifyPerson.operation';
import { exportedProperties as agentRunProspectorProperties } from './actions/agent/runProspector.operation';
import { exportedProperties as agentRunSequenceProperties } from './actions/agent/runSequence.operation';
// Playbook
import { exportedProperties as playbookCreateProperties } from './actions/playbook/create.operation';
import { exportedProperties as playbookGetProperties } from './actions/playbook/get.operation';
import { exportedProperties as playbookListProperties } from './actions/playbook/list.operation';
// ApiKey
import { exportedProperties as apiKeyListProperties } from './actions/apiKey/list.operation';
// Product
import { exportedProperties as productGetProperties } from './actions/product/get.operation';
import { exportedProperties as productListProperties } from './actions/product/list.operation';
// Persona
import { exportedProperties as personaGetProperties } from './actions/persona/get.operation';
import { exportedProperties as personaListProperties } from './actions/persona/list.operation';
// Reference
import { exportedProperties as referenceCreateProperties } from './actions/reference/create.operation';
import { exportedProperties as referenceGetProperties } from './actions/reference/get.operation';
import { exportedProperties as referenceListProperties } from './actions/reference/list.operation';
// UseCase
import { exportedProperties as useCaseGetProperties } from './actions/useCase/get.operation';
import { exportedProperties as useCaseListProperties } from './actions/useCase/list.operation';
// Async
import { exportedProperties as asyncGenerateHeadlessEmailsProperties } from './actions/async/generateHeadlessEmails.operation';
import { exportedProperties as asyncRunAgentProperties } from './actions/async/runAgent.operation';
// Headless
import { exportedProperties as headlessGenerateEmailsProperties } from './actions/headless/generateEmails.operation';
// Competitor
import { exportedProperties as competitorGetProperties } from './actions/competitor/get.operation';
import { exportedProperties as competitorListProperties } from './actions/competitor/list.operation';
// Segment
import { exportedProperties as segmentGetProperties } from './actions/segment/get.operation';
import { exportedProperties as segmentListProperties } from './actions/segment/list.operation';
// Experiment
import { exportedProperties as experimentCreateProperties } from './actions/experiment/create.operation';

export class Octave implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Octave',
        name: 'octave',
        icon: 'file:octave.svg',
        group: ['ai'],
        version: 1,
        subtitle: '={{$parameter["operation"].replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()) }}',
        description: 'Interact with the Octave V2 API',
        defaults: {
            name: 'Octave',
        },
        usableAsTool: true,
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'octaveApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Agent',
                        value: 'agent',
                    },
                    {
                        name: 'API Key',
                        value: 'apiKey',
                    },
                    {
                        name: 'Async',
                        value: 'async',
                    },
                    {
                        name: 'Competitor',
                        value: 'competitor',
                    },
                    {
                        name: 'Experiment',
                        value: 'experiment',
                    },
                    {
                        name: 'Headless',
                        value: 'headless',
                    },
                    {
                        name: 'Persona',
                        value: 'persona',
                    },
                    {
                        name: 'Playbook',
                        value: 'playbook',
                    },
                    {
                        name: 'Product',
                        value: 'product',
                    },
                    {
                        name: 'Reference',
                        value: 'reference',
                    },
                    {
                        name: 'Segment',
                        value: 'segment',
                    },
                    {
                        name: 'Use Case',
                        value: 'useCase',
                    },
                ],
                default: 'agent',
            },
            // Operation Selectors
            ...agentOperations,
            ...playbookOperations,
            ...apiKeyOperations,
            ...productOperations,
            ...personaOperations,
            ...referenceOperations,
            ...useCaseOperations,
            ...asyncOperations,
            ...headlessOperations,
            ...competitorOperations,
            ...segmentOperations,
            ...experimentOperations,
            // Resource Fields (now from individual operation files)
            ...agentListProperties,
            ...agentBuildWorkspaceProperties,
            ...agentCallPrepProperties,
            ...agentEnrichCompanyProperties,
            ...agentEnrichPersonProperties,
            ...agentGenerateContentProperties,
            ...agentRunSequenceProperties,
            ...agentRunProspectorProperties,
            ...agentQualifyCompanyProperties,
            ...agentQualifyPersonProperties,
            ...playbookListProperties,
            ...playbookGetProperties,
            ...playbookCreateProperties,
            ...apiKeyListProperties,
            ...productListProperties,
            ...productGetProperties,
            ...personaListProperties,
            ...personaGetProperties,
            ...referenceListProperties,
            ...referenceGetProperties,
            ...referenceCreateProperties,
            ...useCaseListProperties,
            ...useCaseGetProperties,
            ...asyncRunAgentProperties,
            ...asyncGenerateHeadlessEmailsProperties,
            ...headlessGenerateEmailsProperties,
            ...competitorListProperties,
            ...competitorGetProperties,
            ...segmentListProperties,
            ...segmentGetProperties,
            ...experimentCreateProperties,
        ],
    };

    methods = {
        loadOptions: {
            getAgents,
            getPlaybooks,
            getPersonas,
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // The main loop for iterating over input items
        for (let i = 0; i < items.length; i++) {
            try {
                // Call the new router function
                // The router is responsible for identifying the resource and operation
                // and calling the appropriate action file.
                const result = await router.call(this, i);

                if (result && result.length > 0 && result[0].length > 0) {
                    returnData.push(...result[0]);
                }

            } catch (error) {
                if (this.continueOnFail()) {
                    const errorJson: Record<string, any> = { error: error.message };
                    if (error.context) errorJson.context = error.context;
                    // For API errors that might have a structured response
                    if (error.response && error.response.body) {
                        // Attempt to parse if string, otherwise use as is
                        try {
                            errorJson.apiResponse = typeof error.response.body === 'string' ? JSON.parse(error.response.body) : error.response.body;
                        } catch (parseError) {
                            // If parsing fails, store the raw string body
                            errorJson.apiResponse = error.response.body;
                            errorJson.parseError = 'Failed to parse API response body.';
                        }
                    } else if (error.cause) { // Include cause if present (e.g. from NodeOperationError)
                        errorJson.cause = error.cause;
                    }
                    returnData.push({ json: errorJson, pairedItem: i });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
