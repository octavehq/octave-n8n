import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

// Agent Operations
import * as agentBuildWorkspaceOp from './agent/buildWorkspace.operation';
import * as agentEnrichCompanyOp from './agent/enrichCompany.operation';
import * as agentEnrichPersonOp from './agent/enrichPerson.operation';
import * as agentGenerateContentOp from './agent/generateContent.operation';
import * as agentListOp from './agent/list.operation';
import * as agentPersonalizeTemplateOp from './agent/personalizeTemplate.operation';
import * as agentQualifyCompanyOp from './agent/qualifyCompany.operation';
import * as agentQualifyPersonOp from './agent/qualifyPerson.operation';
import * as agentRunProspectorOp from './agent/runProspector.operation';
import * as agentRunSequenceOp from './agent/runSequence.operation';

// Playbook Operations
import * as playbookCreateOp from './playbook/create.operation';
import * as playbookGetOp from './playbook/get.operation';
import * as playbookListOp from './playbook/list.operation';

// ApiKey Operations
import * as apiKeyListOp from './apiKey/list.operation';

// Product Operations
import * as productGetOp from './product/get.operation';
import * as productListOp from './product/list.operation';

// Persona Operations
import * as personaGetOp from './persona/get.operation';
import * as personaListOp from './persona/list.operation';

// Reference Operations
import * as referenceCreateOp from './reference/create.operation';
import * as referenceGetOp from './reference/get.operation';
import * as referenceListOp from './reference/list.operation';

// UseCase Operations
import * as useCaseGetOp from './useCase/get.operation';
import * as useCaseListOp from './useCase/list.operation';

// Async Operations
import * as asyncGenerateHeadlessEmailsOp from './async/generateHeadlessEmails.operation';
import * as asyncRunAgentOp from './async/runAgent.operation';

// Headless Operations
import * as headlessGenerateEmailsOp from './headless/generateEmails.operation';

export async function router(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const resource = this.getNodeParameter('resource', itemIndex) as string;
    const operation = this.getNodeParameter('operation', itemIndex) as string;

    if (resource === 'agent') {
        if (operation === 'list') return agentListOp.execute.call(this, itemIndex);
        if (operation === 'enrichCompany') return agentEnrichCompanyOp.execute.call(this, itemIndex);
        if (operation === 'enrichPerson') return agentEnrichPersonOp.execute.call(this, itemIndex);
        if (operation === 'generateContent') return agentGenerateContentOp.execute.call(this, itemIndex);
        if (operation === 'runSequence') return agentRunSequenceOp.execute.call(this, itemIndex);
        if (operation === 'personalizeTemplate') return agentPersonalizeTemplateOp.execute.call(this, itemIndex);
        if (operation === 'runProspector') return agentRunProspectorOp.execute.call(this, itemIndex);
        if (operation === 'qualifyCompany') return agentQualifyCompanyOp.execute.call(this, itemIndex);
        if (operation === 'qualifyPerson') return agentQualifyPersonOp.execute.call(this, itemIndex);
        if (operation === 'buildWorkspace') return agentBuildWorkspaceOp.execute.call(this, itemIndex);
    }
    else if (resource === 'playbook') {
        if (operation === 'list') return playbookListOp.execute.call(this, itemIndex);
        if (operation === 'get') return playbookGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return playbookCreateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'apiKey') {
        if (operation === 'list') return apiKeyListOp.execute.call(this, itemIndex);
    }
    else if (resource === 'product') {
        if (operation === 'list') return productListOp.execute.call(this, itemIndex);
        if (operation === 'get') return productGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'persona') {
        if (operation === 'list') return personaListOp.execute.call(this, itemIndex);
        if (operation === 'get') return personaGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'reference') {
        if (operation === 'list') return referenceListOp.execute.call(this, itemIndex);
        if (operation === 'get') return referenceGetOp.execute.call(this, itemIndex);
        if (operation === 'create') return referenceCreateOp.execute.call(this, itemIndex);
    }
    else if (resource === 'useCase') {
        if (operation === 'list') return useCaseListOp.execute.call(this, itemIndex);
        if (operation === 'get') return useCaseGetOp.execute.call(this, itemIndex);
    }
    else if (resource === 'async') {
        if (operation === 'runAgent') return asyncRunAgentOp.execute.call(this, itemIndex);
        if (operation === 'generateHeadlessEmails') return asyncGenerateHeadlessEmailsOp.execute.call(this, itemIndex);
    }
    else if (resource === 'headless') {
        if (operation === 'generateEmails') return headlessGenerateEmailsOp.execute.call(this, itemIndex);
    }

    throw new NodeOperationError(this.getNode(), `The combination of resource '${resource}' and operation '${operation}' is not supported for routing.`, { itemIndex });
}