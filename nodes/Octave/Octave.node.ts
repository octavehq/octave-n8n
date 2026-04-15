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
import { getAgents, getPersonas, getPlaybooks, getProducts } from './methods/loadOptions';

// Description imports for Operations
import { agentOperations } from './descriptions/AgentDescription';
import { asyncOperations } from './descriptions/AsyncDescription';
import { brandVoiceOperations } from './descriptions/BrandVoiceDescription';
import { buyingTriggerOperations } from './descriptions/BuyingTriggerDescription';
import { personaOperations } from './descriptions/PersonaDescription';
import { playbookOperations } from './descriptions/PlaybookDescription';
import { productOperations } from './descriptions/ProductDescription';
import { referenceOperations } from './descriptions/ReferenceDescription';
import { resourceOperations } from './descriptions/ResourceDescription';
import { solutionOperations } from './descriptions/SolutionDescription';
import { useCaseOperations } from './descriptions/UseCaseDescription';
import { competitorOperations } from './descriptions/CompetitorDescription';
import { segmentOperations } from './descriptions/SegmentDescription';
import { experimentOperations } from './descriptions/ExperimentDescription';
import { proofPointDescription } from './descriptions/ProofPointDescription';
import { workflowOperations } from './descriptions/WorkflowDescription';

// Operation Property imports
// Agent
import { exportedProperties as agentBuildWorkspaceProperties } from './actions/agent/buildWorkspace.operation';
import { exportedProperties as agentCallPrepProperties } from './actions/agent/callPrep.operation';
import { exportedProperties as agentCreateProperties } from './actions/agent/create.operation';
import { exportedProperties as agentDeleteProperties } from './actions/agent/delete.operation';
import { exportedProperties as agentEnrichCompanyProperties } from './actions/agent/enrichCompany.operation';
import { exportedProperties as agentEnrichPersonProperties } from './actions/agent/enrichPerson.operation';
import { exportedProperties as agentGenerateContentProperties } from './actions/agent/generateContent.operation';
import { exportedProperties as agentGetProperties } from './actions/agent/get.operation';
import { exportedProperties as agentListProperties } from './actions/agent/list.operation';
import { exportedProperties as agentQualifyCompanyProperties } from './actions/agent/qualifyCompany.operation';
import { exportedProperties as agentQualifyPersonProperties } from './actions/agent/qualifyPerson.operation';
import { exportedProperties as agentRunContextProperties } from './actions/agent/runContext.operation';
import { exportedProperties as agentRunProspectorProperties } from './actions/agent/runProspector.operation';
import { exportedProperties as agentRunSequenceProperties } from './actions/agent/runSequence.operation';
import { exportedProperties as agentUpdateProperties } from './actions/agent/update.operation';
// Playbook
import { exportedProperties as playbookCreateProperties } from './actions/playbook/create.operation';
import { exportedProperties as playbookGetProperties } from './actions/playbook/get.operation';
import { exportedProperties as playbookListProperties } from './actions/playbook/list.operation';
import { exportedProperties as playbookUpdateProperties } from './actions/playbook/update.operation';
// Product
import { exportedProperties as productGetProperties } from './actions/product/get.operation';
import { exportedProperties as productListProperties } from './actions/product/list.operation';
import { exportedProperties as productCreateProperties } from './actions/product/create.operation';
import { exportedProperties as productUpdateProperties } from './actions/product/update.operation';
import { exportedProperties as productGenerateProperties } from './actions/product/generate.operation';
// Persona
import { exportedProperties as personaGetProperties } from './actions/persona/get.operation';
import { exportedProperties as personaListProperties } from './actions/persona/list.operation';
import { exportedProperties as personaCreateProperties } from './actions/persona/create.operation';
import { exportedProperties as personaUpdateProperties } from './actions/persona/update.operation';
import { exportedProperties as personaGenerateProperties } from './actions/persona/generate.operation';
// Reference
import { exportedProperties as referenceCreateProperties } from './actions/reference/create.operation';
import { exportedProperties as referenceGetProperties } from './actions/reference/get.operation';
import { exportedProperties as referenceListProperties } from './actions/reference/list.operation';
import { exportedProperties as referenceUpdateProperties } from './actions/reference/update.operation';
import { exportedProperties as referenceGenerateProperties } from './actions/reference/generate.operation';
// UseCase
import { exportedProperties as useCaseGetProperties } from './actions/useCase/get.operation';
import { exportedProperties as useCaseListProperties } from './actions/useCase/list.operation';
import { exportedProperties as useCaseCreateProperties } from './actions/useCase/create.operation';
import { exportedProperties as useCaseUpdateProperties } from './actions/useCase/update.operation';
import { exportedProperties as useCaseGenerateProperties } from './actions/useCase/generate.operation';
// Async
import { exportedProperties as asyncRunAgentProperties } from './actions/async/runAgent.operation';
import { exportedProperties as asyncRunAgentStatusProperties } from './actions/async/runAgentStatus.operation';
// Competitor
import { exportedProperties as competitorGetProperties } from './actions/competitor/get.operation';
import { exportedProperties as competitorListProperties } from './actions/competitor/list.operation';
import { exportedProperties as competitorCreateProperties } from './actions/competitor/create.operation';
import { exportedProperties as competitorUpdateProperties } from './actions/competitor/update.operation';
import { exportedProperties as competitorGenerateProperties } from './actions/competitor/generate.operation';
// Segment
import { exportedProperties as segmentGetProperties } from './actions/segment/get.operation';
import { exportedProperties as segmentListProperties } from './actions/segment/list.operation';
import { exportedProperties as segmentCreateProperties } from './actions/segment/create.operation';
import { exportedProperties as segmentUpdateProperties } from './actions/segment/update.operation';
import { exportedProperties as segmentGenerateProperties } from './actions/segment/generate.operation';
// Experiment
import { exportedProperties as experimentCreateProperties } from './actions/experiment/create.operation';
// Proof Point
import { exportedProperties as proofPointCreateProperties } from './actions/proofPoint/create.operation';
import { exportedProperties as proofPointGetProperties } from './actions/proofPoint/get.operation';
import { exportedProperties as proofPointListProperties } from './actions/proofPoint/list.operation';
import { exportedProperties as proofPointUpdateProperties } from './actions/proofPoint/update.operation';
import { exportedProperties as proofPointGenerateProperties } from './actions/proofPoint/generate.operation';
// Brand Voice
import { exportedProperties as brandVoiceListProperties } from './actions/brandVoice/list.operation';
import { exportedProperties as brandVoiceGetProperties } from './actions/brandVoice/get.operation';
import { exportedProperties as brandVoiceCreateProperties } from './actions/brandVoice/create.operation';
import { exportedProperties as brandVoiceUpdateProperties } from './actions/brandVoice/update.operation';
import { exportedProperties as brandVoiceGenerateProperties } from './actions/brandVoice/generate.operation';
import { exportedProperties as brandVoiceApplyProperties } from './actions/brandVoice/apply.operation';
import { exportedProperties as brandVoiceToggleDefaultProperties } from './actions/brandVoice/toggleDefault.operation';
// Buying Trigger
import { exportedProperties as buyingTriggerListProperties } from './actions/buyingTrigger/list.operation';
import { exportedProperties as buyingTriggerGetProperties } from './actions/buyingTrigger/get.operation';
import { exportedProperties as buyingTriggerCreateProperties } from './actions/buyingTrigger/create.operation';
import { exportedProperties as buyingTriggerUpdateProperties } from './actions/buyingTrigger/update.operation';
import { exportedProperties as buyingTriggerGenerateProperties } from './actions/buyingTrigger/generate.operation';
import { exportedProperties as buyingTriggerDeleteProperties } from './actions/buyingTrigger/delete.operation';
// Solution
import { exportedProperties as solutionListProperties } from './actions/solution/list.operation';
import { exportedProperties as solutionGetProperties } from './actions/solution/get.operation';
import { exportedProperties as solutionCreateProperties } from './actions/solution/create.operation';
import { exportedProperties as solutionUpdateProperties } from './actions/solution/update.operation';
import { exportedProperties as solutionGenerateProperties } from './actions/solution/generate.operation';
import { exportedProperties as solutionDeleteProperties } from './actions/solution/delete.operation';
// Resource
import { exportedProperties as resourceListProperties } from './actions/resource/list.operation';
import { exportedProperties as resourceGetProperties } from './actions/resource/get.operation';
import { exportedProperties as resourceCreateProperties } from './actions/resource/create.operation';
import { exportedProperties as resourceDeleteProperties } from './actions/resource/delete.operation';
import { exportedProperties as resourceSearchProperties } from './actions/resource/search.operation';
import { exportedProperties as resourceStatusProperties } from './actions/resource/status.operation';
// Workflow
import { exportedProperties as workflowRunProperties } from './actions/workflow/run.operation';
import { exportedProperties as workflowRunStatusProperties } from './actions/workflow/runStatus.operation';

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
                        name: 'Async',
                        value: 'async',
                    },
                    {
                        name: 'Brand Voice',
                        value: 'brandVoice',
                    },
                    {
                        name: 'Buying Trigger',
                        value: 'buyingTrigger',
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
                        name: 'Proof Point',
                        value: 'proofPoint',
                    },
                    {
                        name: 'Reference',
                        value: 'reference',
                    },
                    {
                        name: 'Resource',
                        value: 'resource',
                    },
                    {
                        name: 'Segment',
                        value: 'segment',
                    },
                    {
                        name: 'Solution',
                        value: 'solution',
                    },
                    {
                        name: 'Use Case',
                        value: 'useCase',
                    },
                    {
                        name: 'Workflow',
                        value: 'workflow',
                    },
                ],
                default: 'agent',
            },
            // Operation Selectors
            ...agentOperations,
            ...playbookOperations,
            ...productOperations,
            ...personaOperations,
            ...proofPointDescription,
            ...referenceOperations,
            ...useCaseOperations,
            ...asyncOperations,
            ...competitorOperations,
            ...segmentOperations,
            ...experimentOperations,
            ...brandVoiceOperations,
            ...buyingTriggerOperations,
            ...solutionOperations,
            ...resourceOperations,
            ...workflowOperations,
            // Resource Fields (now from individual operation files)
            ...agentListProperties,
            ...agentGetProperties,
            ...agentCreateProperties,
            ...agentUpdateProperties,
            ...agentDeleteProperties,
            ...agentBuildWorkspaceProperties,
            ...agentCallPrepProperties,
            ...agentEnrichCompanyProperties,
            ...agentEnrichPersonProperties,
            ...agentGenerateContentProperties,
            ...agentRunSequenceProperties,
            ...agentRunProspectorProperties,
            ...agentRunContextProperties,
            ...agentQualifyCompanyProperties,
            ...agentQualifyPersonProperties,
            ...playbookListProperties,
            ...playbookGetProperties,
            ...playbookCreateProperties,
            ...playbookUpdateProperties,
            ...productListProperties,
            ...productGetProperties,
            ...productCreateProperties,
            ...productUpdateProperties,
            ...productGenerateProperties,
            ...personaListProperties,
            ...personaGetProperties,
            ...personaCreateProperties,
            ...personaUpdateProperties,
            ...personaGenerateProperties,
            ...referenceListProperties,
            ...referenceGetProperties,
            ...referenceCreateProperties,
            ...referenceUpdateProperties,
            ...referenceGenerateProperties,
            ...useCaseListProperties,
            ...useCaseGetProperties,
            ...useCaseCreateProperties,
            ...useCaseUpdateProperties,
            ...useCaseGenerateProperties,
            ...asyncRunAgentProperties,
            ...asyncRunAgentStatusProperties,
            ...competitorListProperties,
            ...competitorGetProperties,
            ...competitorCreateProperties,
            ...competitorUpdateProperties,
            ...competitorGenerateProperties,
            ...segmentListProperties,
            ...segmentGetProperties,
            ...segmentCreateProperties,
            ...segmentUpdateProperties,
            ...segmentGenerateProperties,
            ...experimentCreateProperties,
            ...proofPointListProperties,
            ...proofPointGetProperties,
            ...proofPointCreateProperties,
            ...proofPointUpdateProperties,
            ...proofPointGenerateProperties,
            ...brandVoiceListProperties,
            ...brandVoiceGetProperties,
            ...brandVoiceCreateProperties,
            ...brandVoiceUpdateProperties,
            ...brandVoiceGenerateProperties,
            ...brandVoiceApplyProperties,
            ...brandVoiceToggleDefaultProperties,
            ...buyingTriggerListProperties,
            ...buyingTriggerGetProperties,
            ...buyingTriggerCreateProperties,
            ...buyingTriggerUpdateProperties,
            ...buyingTriggerGenerateProperties,
            ...buyingTriggerDeleteProperties,
            ...solutionListProperties,
            ...solutionGetProperties,
            ...solutionCreateProperties,
            ...solutionUpdateProperties,
            ...solutionGenerateProperties,
            ...solutionDeleteProperties,
            ...resourceListProperties,
            ...resourceGetProperties,
            ...resourceCreateProperties,
            ...resourceDeleteProperties,
            ...resourceSearchProperties,
            ...resourceStatusProperties,
            ...workflowRunProperties,
            ...workflowRunStatusProperties,
        ],
    };

    methods = {
        loadOptions: {
            getAgents,
            getPlaybooks,
            getPersonas,
            getProducts,
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
