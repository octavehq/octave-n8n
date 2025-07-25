import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

// Agent Operations
import * as agentBuildWorkspaceOp from './agent/buildWorkspace.operation';
import * as agentCallPrepOp from './agent/callPrep.operation';
import * as agentEnrichCompanyOp from './agent/enrichCompany.operation';
import * as agentEnrichPersonOp from './agent/enrichPerson.operation';
import * as agentGenerateContentOp from './agent/generateContent.operation';
import * as agentListOp from './agent/list.operation';
import * as agentQualifyCompanyOp from './agent/qualifyCompany.operation';
import * as agentQualifyPersonOp from './agent/qualifyPerson.operation';
import * as agentRunProspectorOp from './agent/runProspector.operation';
import * as agentRunSequenceOp from './agent/runSequence.operation';

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

// Persona Operations
import * as personaCreateOp from './persona/create.operation';
import * as personaGetOp from './persona/get.operation';
import * as personaListOp from './persona/list.operation';
import * as personaUpdateOp from './persona/update.operation';
import * as personaGenerateOp from './persona/generate.operation';

// Reference Operations
import * as referenceCreateOp from './reference/create.operation';
import * as referenceGetOp from './reference/get.operation';
import * as referenceListOp from './reference/list.operation';
import * as referenceUpdateOp from './reference/update.operation';

// UseCase Operations
import * as useCaseCreateOp from './useCase/create.operation';
import * as useCaseGetOp from './useCase/get.operation';
import * as useCaseListOp from './useCase/list.operation';
import * as useCaseUpdateOp from './useCase/update.operation';
import * as useCaseGenerateOp from './useCase/generate.operation';

// Async Operations
import * as asyncGenerateHeadlessEmailsOp from './async/generateHeadlessEmails.operation';
import * as asyncRunAgentOp from './async/runAgent.operation';

// Headless Operations
import * as headlessGenerateEmailsOp from './headless/generateEmails.operation';

// Competitor Operations
import * as competitorCreateOp from './competitor/create.operation';
import * as competitorGetOp from './competitor/get.operation';
import * as competitorListOp from './competitor/list.operation';
import * as competitorUpdateOp from './competitor/update.operation';
import * as competitorGenerateOp from './competitor/generate.operation';

// Segment Operations
import * as segmentCreateOp from './segment/create.operation';
import * as segmentGetOp from './segment/get.operation';
import * as segmentListOp from './segment/list.operation';
import * as segmentUpdateOp from './segment/update.operation';
import * as segmentGenerateOp from './segment/generate.operation';

// Experiment Operations
import * as experimentCreateOp from './experiment/create.operation';

// Proof Point Operations
import * as proofPointCreateOp from './proofPoint/create.operation';
import * as proofPointGetOp from './proofPoint/get.operation';
import * as proofPointListOp from './proofPoint/list.operation';
import * as proofPointUpdateOp from './proofPoint/update.operation';
import * as proofPointGenerateOp from './proofPoint/generate.operation';

export async function router(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const resource = this.getNodeParameter('resource', itemIndex) as string;
    const operation = this.getNodeParameter('operation', itemIndex) as string;

    if (resource === 'agent') {
        if (operation === 'list') return agentListOp.execute.call(this, itemIndex);
        if (operation === 'buildWorkspace') return agentBuildWorkspaceOp.execute.call(this, itemIndex);
        if (operation === 'callPrep') return agentCallPrepOp.execute.call(this, itemIndex);
        if (operation === 'enrichCompany') return agentEnrichCompanyOp.execute.call(this, itemIndex);
        if (operation === 'enrichPerson') return agentEnrichPersonOp.execute.call(this, itemIndex);
        if (operation === 'generateContent') return agentGenerateContentOp.execute.call(this, itemIndex);
        if (operation === 'runSequence') return agentRunSequenceOp.execute.call(this, itemIndex);
        if (operation === 'runProspector') return agentRunProspectorOp.execute.call(this, itemIndex);
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
    }
    else if (resource === 'persona') {
        if (operation === 'list') return personaListOp.execute.call(this, itemIndex);
        if (operation === 'get') return personaGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return personaCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return personaUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return personaGenerateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reference') {
        if (operation === 'list') return referenceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return referenceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return referenceCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return referenceUpdateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'useCase') {
        if (operation === 'list') return useCaseListOp.execute.call(this, itemIndex);
        if (operation === 'get') return useCaseGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return useCaseCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return useCaseUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return useCaseGenerateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'async') {
        if (operation === 'runAgent') return asyncRunAgentOp.execute.call(this, itemIndex);
        if (operation === 'generateHeadlessEmails') return asyncGenerateHeadlessEmailsOp.execute.call(this, itemIndex);
    }
    else if (resource === 'headless') {
        if (operation === 'generateEmails') return headlessGenerateEmailsOp.execute.call(this, itemIndex);
    }
    else if (resource === 'competitor') {
        if (operation === 'list') return competitorListOp.execute.call(this, itemIndex);
        if (operation === 'get') return competitorGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return competitorCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return competitorUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return competitorGenerateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'segment') {
        if (operation === 'list') return segmentListOp.execute.call(this, itemIndex);
        if (operation === 'get') return segmentGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return segmentCreateOp.execute.call(this, itemIndex);
        if (operation === 'update') return segmentUpdateOp.execute.call(this, itemIndex);
        if (operation === 'generate') return segmentGenerateOp.execute.call(this, itemIndex);
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
    }

    throw new NodeOperationError(this.getNode(), `The combination of resource '${resource}' and operation '${operation}' is not supported for routing.`, { itemIndex });
}