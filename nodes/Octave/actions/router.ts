import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

// Agent Operations
import * as agentBuildWorkspaceOp from './agent/buildWorkspace.operation';
import * as agentCallPrepOp from './agent/callPrep.operation';
import * as agentCreateOp from './agent/create.operation';
import * as agentDeleteOp from './agent/delete.operation';
import * as agentEnrichCompanyOp from './agent/enrichCompany.operation';
import * as agentEnrichPersonOp from './agent/enrichPerson.operation';
import * as agentGenerateContentOp from './agent/generateContent.operation';
import * as agentGetOp from './agent/get.operation';
import * as agentLanguagesOp from './agent/languages.operation';
import * as agentListOp from './agent/list.operation';
import * as agentQualifyCompanyOp from './agent/qualifyCompany.operation';
import * as agentQualifyPersonOp from './agent/qualifyPerson.operation';
import * as agentRunContextOp from './agent/runContext.operation';
import * as agentRunProspectorOp from './agent/runProspector.operation';
import * as agentRunSequenceOp from './agent/runSequence.operation';
import * as agentUpdateOp from './agent/update.operation';

// Playbook Operations
import * as playbookCreateOp from './playbook/create.operation';
import * as playbookGetOp from './playbook/get.operation';
import * as playbookListOp from './playbook/list.operation';
import * as playbookUpdateOp from './playbook/update.operation';

// Product Operations
import * as productCreateOp from './product/create.operation';
import * as productGetOp from './product/get.operation';
import * as productListOp from './product/list.operation';
import * as productUpdateOp from './product/update.operation';
import * as productGenerateOp from './product/generate.operation';
import * as productDeleteOp from './product/delete.operation';

// Persona Operations
import * as personaCreateOp from './persona/create.operation';
import * as personaGetOp from './persona/get.operation';
import * as personaListOp from './persona/list.operation';
import * as personaUpdateOp from './persona/update.operation';
import * as personaGenerateOp from './persona/generate.operation';
import * as personaDeleteOp from './persona/delete.operation';

// Reference Operations
import * as referenceCreateOp from './reference/create.operation';
import * as referenceGetOp from './reference/get.operation';
import * as referenceListOp from './reference/list.operation';
import * as referenceUpdateOp from './reference/update.operation';
import * as referenceGenerateOp from './reference/generate.operation';
import * as referenceDeleteOp from './reference/delete.operation';

// UseCase Operations
import * as useCaseCreateOp from './useCase/create.operation';
import * as useCaseGetOp from './useCase/get.operation';
import * as useCaseListOp from './useCase/list.operation';
import * as useCaseUpdateOp from './useCase/update.operation';
import * as useCaseGenerateOp from './useCase/generate.operation';
import * as useCaseDeleteOp from './useCase/delete.operation';

// Async Operations
import * as asyncRunAgentOp from './async/runAgent.operation';
import * as asyncRunAgentStatusOp from './async/runAgentStatus.operation';

// Competitor Operations
import * as competitorCreateOp from './competitor/create.operation';
import * as competitorGetOp from './competitor/get.operation';
import * as competitorListOp from './competitor/list.operation';
import * as competitorUpdateOp from './competitor/update.operation';
import * as competitorGenerateOp from './competitor/generate.operation';
import * as competitorDeleteOp from './competitor/delete.operation';

// Segment Operations
import * as segmentCreateOp from './segment/create.operation';
import * as segmentGetOp from './segment/get.operation';
import * as segmentListOp from './segment/list.operation';
import * as segmentUpdateOp from './segment/update.operation';
import * as segmentGenerateOp from './segment/generate.operation';
import * as segmentDeleteOp from './segment/delete.operation';

// Experiment Operations
import * as experimentCreateOp from './experiment/create.operation';

// Proof Point Operations
import * as proofPointCreateOp from './proofPoint/create.operation';
import * as proofPointGetOp from './proofPoint/get.operation';
import * as proofPointListOp from './proofPoint/list.operation';
import * as proofPointUpdateOp from './proofPoint/update.operation';
import * as proofPointGenerateOp from './proofPoint/generate.operation';
import * as proofPointDeleteOp from './proofPoint/delete.operation';

// Brand Voice Operations
import * as brandVoiceListOp from './brandVoice/list.operation';
import * as brandVoiceGetOp from './brandVoice/get.operation';
import * as brandVoiceCreateOp from './brandVoice/create.operation';
import * as brandVoiceUpdateOp from './brandVoice/update.operation';
import * as brandVoiceGenerateOp from './brandVoice/generate.operation';
import * as brandVoiceApplyOp from './brandVoice/apply.operation';
import * as brandVoiceToggleDefaultOp from './brandVoice/toggleDefault.operation';

// Buying Trigger Operations
import * as buyingTriggerListOp from './buyingTrigger/list.operation';
import * as buyingTriggerGetOp from './buyingTrigger/get.operation';
import * as buyingTriggerCreateOp from './buyingTrigger/create.operation';
import * as buyingTriggerUpdateOp from './buyingTrigger/update.operation';
import * as buyingTriggerGenerateOp from './buyingTrigger/generate.operation';
import * as buyingTriggerDeleteOp from './buyingTrigger/delete.operation';

// Solution Operations
import * as solutionListOp from './solution/list.operation';
import * as solutionGetOp from './solution/get.operation';
import * as solutionCreateOp from './solution/create.operation';
import * as solutionUpdateOp from './solution/update.operation';
import * as solutionGenerateOp from './solution/generate.operation';
import * as solutionDeleteOp from './solution/delete.operation';

// Service Operations
import * as serviceListOp from './service/list.operation';
import * as serviceGetOp from './service/get.operation';
import * as serviceCreateOp from './service/create.operation';
import * as serviceUpdateOp from './service/update.operation';
import * as serviceGenerateOp from './service/generate.operation';
import * as serviceDeleteOp from './service/delete.operation';

// Resource Operations
import * as resourceListOp from './resource/list.operation';
import * as resourceGetOp from './resource/get.operation';
import * as resourceCreateOp from './resource/create.operation';
import * as resourceDeleteOp from './resource/delete.operation';
import * as resourceSearchOp from './resource/search.operation';
import * as resourceStatusOp from './resource/status.operation';

// Workflow Operations
import * as workflowRunOp from './workflow/run.operation';
import * as workflowRunStatusOp from './workflow/runStatus.operation';

// Alternative Operations
import * as alternativeListOp from './alternative/list.operation';
import * as alternativeGetOp from './alternative/get.operation';
import * as alternativeCreateOp from './alternative/create.operation';
import * as alternativeUpdateOp from './alternative/update.operation';
import * as alternativeGenerateOp from './alternative/generate.operation';
import * as alternativeDeleteOp from './alternative/delete.operation';

// Core Feature Operations
import * as coreFeatureListOp from './coreFeature/list.operation';
import * as coreFeatureGetOp from './coreFeature/get.operation';
import * as coreFeatureCreateOp from './coreFeature/create.operation';
import * as coreFeatureUpdateOp from './coreFeature/update.operation';
import * as coreFeatureGenerateOp from './coreFeature/generate.operation';
import * as coreFeatureDeleteOp from './coreFeature/delete.operation';

// Objection Operations
import * as objectionListOp from './objection/list.operation';
import * as objectionGetOp from './objection/get.operation';
import * as objectionCreateOp from './objection/create.operation';
import * as objectionUpdateOp from './objection/update.operation';
import * as objectionGenerateOp from './objection/generate.operation';
import * as objectionDeleteOp from './objection/delete.operation';

// Motion Operations
import * as motionListOp from './motion/list.operation';
import * as motionGetOp from './motion/get.operation';
import * as motionCreateOp from './motion/create.operation';
import * as motionUpdateOp from './motion/update.operation';
import * as motionDeleteOp from './motion/delete.operation';

// Motion Playbook Operations
import * as motionPlaybookListOp from './motionPlaybook/list.operation';
import * as motionPlaybookGetOp from './motionPlaybook/get.operation';
import * as motionPlaybookCreateOp from './motionPlaybook/create.operation';
import * as motionPlaybookUpdateOp from './motionPlaybook/update.operation';
import * as motionPlaybookDeleteOp from './motionPlaybook/delete.operation';

// Motion ICP Operations
import * as motionIcpListOp from './motionIcp/list.operation';
import * as motionIcpGetOp from './motionIcp/get.operation';
import * as motionIcpListElementsOp from './motionIcp/listElements.operation';
import * as motionIcpListLearningsOp from './motionIcp/listLearnings.operation';
import * as motionIcpGetLearningOp from './motionIcp/getLearning.operation';

// Workspace Company Operations
import * as workspaceCompanyGetOp from './workspaceCompany/get.operation';
import * as workspaceCompanyGenerateOp from './workspaceCompany/generate.operation';
import * as workspaceCompanyUpdateOp from './workspaceCompany/update.operation';

// Suggestion Operations
import * as suggestionListOp from './suggestion/list.operation';
import * as suggestionGetOp from './suggestion/get.operation';
import * as suggestionCreateOp from './suggestion/create.operation';
import * as suggestionUpdateOp from './suggestion/update.operation';
import * as suggestionAcceptOp from './suggestion/accept.operation';
import * as suggestionRejectOp from './suggestion/reject.operation';

// Context Operations
import * as contextSearchOp from './context/search.operation';

// Insights Operations
import * as insightsCompetitiveOp from './insights/competitive.operation';
import * as insightsEntityStatsOp from './insights/entityStats.operation';
import * as insightsEntityTimeSeriesOp from './insights/entityTimeSeries.operation';
import * as insightsLibraryHealthOp from './insights/libraryHealth.operation';
import * as insightsTopEntitiesOp from './insights/topEntities.operation';
import * as insightsWorkspaceBaselineOp from './insights/workspaceBaseline.operation';

// Event Operations
import * as eventListOp from './event/list.operation';

// Finding Operations
import * as findingListOp from './finding/list.operation';

// Revision Operations
import * as revisionListOp from './revision/list.operation';
import * as revisionGetOp from './revision/get.operation';

// Report Operations
import * as reportConfigListOp from './reportConfig/list.operation';
import * as reportConfigGetOp from './reportConfig/get.operation';
import * as reportGroupListOp from './reportGroup/list.operation';
import * as reportGroupGetOp from './reportGroup/get.operation';
import * as reportRunListOp from './reportRun/list.operation';
import * as reportRunGetOp from './reportRun/get.operation';

export async function router(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const resource = this.getNodeParameter('resource', itemIndex) as string;
    const operation = this.getNodeParameter('operation', itemIndex) as string;

    if (resource === 'agent') {
        if (operation === 'list') return agentListOp.execute.call(this, itemIndex);
        if (operation === 'get') return agentGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return agentCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return agentUpdateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return agentDeleteOp.execute.call(this, itemIndex);
        if (operation === 'languages') return agentLanguagesOp.execute.call(this, itemIndex);
        if (operation === 'buildWorkspace') return agentBuildWorkspaceOp.execute.call(this, itemIndex);
        if (operation === 'callPrep') return agentCallPrepOp.execute.call(this, itemIndex);
        if (operation === 'enrichCompany') return agentEnrichCompanyOp.execute.call(this, itemIndex);
        if (operation === 'enrichPerson') return agentEnrichPersonOp.execute.call(this, itemIndex);
        if (operation === 'generateContent') return agentGenerateContentOp.execute.call(this, itemIndex);
        if (operation === 'runSequence') return agentRunSequenceOp.execute.call(this, itemIndex);
        if (operation === 'runProspector') return agentRunProspectorOp.execute.call(this, itemIndex);
        if (operation === 'runContext') return agentRunContextOp.execute.call(this, itemIndex);
        if (operation === 'qualifyCompany') return agentQualifyCompanyOp.execute.call(this, itemIndex);
        if (operation === 'qualifyPerson') return agentQualifyPersonOp.execute.call(this, itemIndex);
    }
    else if (resource === 'playbook') {
        if (operation === 'list') return playbookListOp.execute.call(this, itemIndex);
        if (operation === 'get') return playbookGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return playbookCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return playbookUpdateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'product') {
        if (operation === 'list') return productListOp.execute.call(this, itemIndex);
        if (operation === 'get') return productGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return productCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return productUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return productGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return productDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'persona') {
        if (operation === 'list') return personaListOp.execute.call(this, itemIndex);
        if (operation === 'get') return personaGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return personaCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return personaUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return personaGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return personaDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reference') {
        if (operation === 'list') return referenceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return referenceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return referenceCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return referenceUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return referenceGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return referenceDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'useCase') {
        if (operation === 'list') return useCaseListOp.execute.call(this, itemIndex);
        if (operation === 'get') return useCaseGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return useCaseCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return useCaseUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return useCaseGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return useCaseDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'async') {
        if (operation === 'runAgent') return asyncRunAgentOp.execute.call(this, itemIndex);
        if (operation === 'runAgentStatus') return asyncRunAgentStatusOp.execute.call(this, itemIndex);
    }
    else if (resource === 'competitor') {
        if (operation === 'list') return competitorListOp.execute.call(this, itemIndex);
        if (operation === 'get') return competitorGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return competitorCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return competitorUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return competitorGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return competitorDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'segment') {
        if (operation === 'list') return segmentListOp.execute.call(this, itemIndex);
        if (operation === 'get') return segmentGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return segmentCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return segmentUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return segmentGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return segmentDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'experiment') {
        if (operation === 'create') return experimentCreateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'proofPoint') {
        if (operation === 'list') return proofPointListOp.execute.call(this, itemIndex);
        if (operation === 'get') return proofPointGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return proofPointCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return proofPointUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return proofPointGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return proofPointDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'brandVoice') {
        if (operation === 'list') return brandVoiceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return brandVoiceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return brandVoiceCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return brandVoiceUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return brandVoiceGenerateOp.execute.call(this, itemIndex);
        if (operation === 'apply') return brandVoiceApplyOp.execute.call(this, itemIndex);
        if (operation === 'toggleDefault') return brandVoiceToggleDefaultOp.execute.call(this, itemIndex);
    }
    else if (resource === 'buyingTrigger') {
        if (operation === 'list') return buyingTriggerListOp.execute.call(this, itemIndex);
        if (operation === 'get') return buyingTriggerGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return buyingTriggerCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return buyingTriggerUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return buyingTriggerGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return buyingTriggerDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'solution') {
        if (operation === 'list') return solutionListOp.execute.call(this, itemIndex);
        if (operation === 'get') return solutionGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return solutionCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return solutionUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return solutionGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return solutionDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'service') {
        if (operation === 'list') return serviceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return serviceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return serviceCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return serviceUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return serviceGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return serviceDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'resource') {
        if (operation === 'list') return resourceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return resourceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return resourceCreateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return resourceDeleteOp.execute.call(this, itemIndex);
        if (operation === 'search') return resourceSearchOp.execute.call(this, itemIndex);
        if (operation === 'status') return resourceStatusOp.execute.call(this, itemIndex);
    }
    else if (resource === 'workflow') {
        if (operation === 'run') return workflowRunOp.execute.call(this, itemIndex);
        if (operation === 'runStatus') return workflowRunStatusOp.execute.call(this, itemIndex);
    }
    else if (resource === 'alternative') {
        if (operation === 'list') return alternativeListOp.execute.call(this, itemIndex);
        if (operation === 'get') return alternativeGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return alternativeCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return alternativeUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return alternativeGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return alternativeDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'coreFeature') {
        if (operation === 'list') return coreFeatureListOp.execute.call(this, itemIndex);
        if (operation === 'get') return coreFeatureGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return coreFeatureCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return coreFeatureUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return coreFeatureGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return coreFeatureDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'objection') {
        if (operation === 'list') return objectionListOp.execute.call(this, itemIndex);
        if (operation === 'get') return objectionGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return objectionCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return objectionUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return objectionGenerateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return objectionDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'motion') {
        if (operation === 'list') return motionListOp.execute.call(this, itemIndex);
        if (operation === 'get') return motionGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return motionCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return motionUpdateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return motionDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'motionPlaybook') {
        if (operation === 'list') return motionPlaybookListOp.execute.call(this, itemIndex);
        if (operation === 'get') return motionPlaybookGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return motionPlaybookCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return motionPlaybookUpdateOp.execute.call(this, itemIndex);
        if (operation === 'delete') return motionPlaybookDeleteOp.execute.call(this, itemIndex);
    }
    else if (resource === 'motionIcp') {
        if (operation === 'list') return motionIcpListOp.execute.call(this, itemIndex);
        if (operation === 'get') return motionIcpGetOp.execute.call(this, itemIndex);
        if (operation === 'listElements') return motionIcpListElementsOp.execute.call(this, itemIndex);
        if (operation === 'listLearnings') return motionIcpListLearningsOp.execute.call(this, itemIndex);
        if (operation === 'getLearning') return motionIcpGetLearningOp.execute.call(this, itemIndex);
    }
    else if (resource === 'workspaceCompany') {
        if (operation === 'get') return workspaceCompanyGetOp.execute.call(this, itemIndex);
        if (operation === 'generate') return workspaceCompanyGenerateOp.execute.call(this, itemIndex);
        if (operation === 'update') return workspaceCompanyUpdateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'suggestion') {
        if (operation === 'list') return suggestionListOp.execute.call(this, itemIndex);
        if (operation === 'get') return suggestionGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return suggestionCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return suggestionUpdateOp.execute.call(this, itemIndex);
        if (operation === 'accept') return suggestionAcceptOp.execute.call(this, itemIndex);
        if (operation === 'reject') return suggestionRejectOp.execute.call(this, itemIndex);
    }
    else if (resource === 'context') {
        if (operation === 'search') return contextSearchOp.execute.call(this, itemIndex);
    }
    else if (resource === 'insights') {
        if (operation === 'competitive') return insightsCompetitiveOp.execute.call(this, itemIndex);
        if (operation === 'entityStats') return insightsEntityStatsOp.execute.call(this, itemIndex);
        if (operation === 'entityTimeSeries') return insightsEntityTimeSeriesOp.execute.call(this, itemIndex);
        if (operation === 'libraryHealth') return insightsLibraryHealthOp.execute.call(this, itemIndex);
        if (operation === 'topEntities') return insightsTopEntitiesOp.execute.call(this, itemIndex);
        if (operation === 'workspaceBaseline') return insightsWorkspaceBaselineOp.execute.call(this, itemIndex);
    }
    else if (resource === 'event') {
        if (operation === 'list') return eventListOp.execute.call(this, itemIndex);
    }
    else if (resource === 'finding') {
        if (operation === 'list') return findingListOp.execute.call(this, itemIndex);
    }
    else if (resource === 'revision') {
        if (operation === 'list') return revisionListOp.execute.call(this, itemIndex);
        if (operation === 'get') return revisionGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reportConfig') {
        if (operation === 'list') return reportConfigListOp.execute.call(this, itemIndex);
        if (operation === 'get') return reportConfigGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reportGroup') {
        if (operation === 'list') return reportGroupListOp.execute.call(this, itemIndex);
        if (operation === 'get') return reportGroupGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reportRun') {
        if (operation === 'list') return reportRunListOp.execute.call(this, itemIndex);
        if (operation === 'get') return reportRunGetOp.execute.call(this, itemIndex);
    }

    throw new NodeOperationError(this.getNode(), `The combination of resource '${resource}' and operation '${operation}' is not supported for routing.`, { itemIndex });
}
