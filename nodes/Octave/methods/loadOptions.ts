import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { octaveApiRequestListAll } from '../transport/OctaveApiRequest';

export async function getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const returnData: INodePropertyOptions[] = [];
    const qs: Record<string, any> = { limit: 200, orderField: 'createdAt', orderDirection: 'ASC' };  // TODO: Switch to name

    const resource = this.getCurrentNodeParameter('resource') as string | undefined;
    const operation = this.getCurrentNodeParameter('operation') as string | undefined;

    let derivedAgentType: string | undefined;

    if (resource === 'agent') {
        if (operation === 'list') {
            // For 'list' operation, use the explicitly selected agentType filter
            derivedAgentType = this.getCurrentNodeParameter('agentType') as string | undefined;
        } else {
            // For other agent operations, map operation to an implicit agentType
            const operationToAgentTypeMap: Record<string, string> = {
                'enrichCompany': 'ENRICH_COMPANY',
                'enrichPerson': 'ENRICH_PERSON',
                'generateContent': 'CONTENT',
                'runSequence': 'EMAIL',
                'callPrep': 'CALL_PREP',
                'runProspector': 'PROSPECTOR',
                'qualifyCompany': 'QUALIFY_COMPANY',
                'qualifyPerson': 'QUALIFY_PERSON',
                // 'buildWorkspace' doesn't use agentOId, so no mapping needed here
            };
            if (operation) {
                derivedAgentType = operationToAgentTypeMap[operation];
            }
        }
    } else if (resource === 'async' && operation === 'runAgent') {
        // For async runAgent, the user might want to filter by type if such a field is added.
        // For now, we can allow an optional agentType filter if a field named 'asyncAgentType' (or similar) exists.
        // Or, we could list all. Let's assume for now we might add an optional filter later.
        // derivedAgentType = this.getCurrentNodeParameter('asyncAgentType') as string | undefined;
        // If no specific filter for async, derivedAgentType will remain undefined, listing all types.
    }

    if (derivedAgentType && derivedAgentType !== '') { // Ensure empty string from 'All' selection doesn't become a type filter
        qs.type = derivedAgentType;
    }

    const agents = await octaveApiRequestListAll.call(this as any, 'GET', '/api/v2/agents/list', qs);
    if (agents && Array.isArray(agents)) {
        for (const agent of agents) {
            if (agent.oId) { // oId is the minimum requirement for value
                returnData.push({
                    name: `${agent.name || 'Unnamed Agent'} (${agent.type || 'N/A'})`,
                    value: agent.oId,
                });
            } else {
                // Fallback for somehow missing oId, though unlikely for /list endpoint
                returnData.push({
                    name: `Invalid Agent Data (Name: ${agent.name || 'N/A'}, Type: ${agent.type || 'N/A'})`,
                    value: 'invalid_agent_id'
                });
            }
        }
    }
    return returnData;
}

export async function getPlaybooks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const returnData: INodePropertyOptions[] = [
        { name: '(None)', value: '' },
    ];
    const playbooks = await octaveApiRequestListAll.call(this as any, 'GET', '/api/v2/playbook/list', { limit: 200, queryType: 'ALL' });
    if (playbooks && Array.isArray(playbooks)) {
        for (const playbook of playbooks) {
            if (playbook.oId && playbook.name) {
                returnData.push({
                    name: playbook.name,
                    value: playbook.oId,
                });
            }
        }
    }
    return returnData;
}

export async function getPersonas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const returnData: INodePropertyOptions[] = [
        { name: '(None)', value: '' },
    ];
    const personas = await octaveApiRequestListAll.call(this as any, 'GET', '/api/v2/persona/list', { limit: 200, queryType: 'ALL' });
    if (personas && Array.isArray(personas)) {
        for (const persona of personas) {
            if (persona.oId && persona.name) {
                returnData.push({
                    name: persona.name,
                    value: persona.oId,
                });
            }
        }
    }
    return returnData;
}

export async function getProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const returnData: INodePropertyOptions[] = [
        { name: '(None)', value: '' },
    ];
    const products = await octaveApiRequestListAll.call(this as any, 'GET', '/api/v2/product/list', { limit: 200, queryType: 'ALL' });
    if (products && Array.isArray(products)) {
        for (const product of products) {
            if (product.oId && product.name) {
                returnData.push({
                    name: product.name,
                    value: product.oId,
                });
            }
        }
    }
    return returnData;
}