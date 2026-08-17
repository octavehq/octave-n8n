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

    throw new NodeOperationError(this.getNode(), `The combination of resource '${resource}' and operation '${operation}' is not supported for routing.`, { itemIndex });
}
