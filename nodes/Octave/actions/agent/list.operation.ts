import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest, octaveApiRequestListAll } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: true,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Offset of the results to return',
    },
    {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'Text search query for agents',
    },
    {
        displayName: 'Agent Type',
        name: 'agentType',
        type: 'options',
        options: [
            { name: 'All', value: '' },
            { name: 'Content', value: 'CONTENT' },
            { name: 'Email', value: 'EMAIL' },
            { name: 'Enrich Company', value: 'ENRICH_COMPANY' },
            { name: 'Enrich Person', value: 'ENRICH_PERSON' },
            { name: 'Personalize Template', value: 'PERSONALIZE_TEMPLATE' },
            { name: 'Prospector', value: 'PROSPECTOR' },
            { name: 'Qualify Company', value: 'QUALIFY_COMPANY' },
            { name: 'Qualify Person', value: 'QUALIFY_PERSON' },
        ],
        default: '',
        description: 'Filter agents by type',
    },
    {
        displayName: 'Order By Field',
        name: 'orderField',
        type: 'options',
        options: [
            { name: 'Created At', value: 'createdAt' },
            { name: 'Updated At', value: 'updatedAt' },
        ],
        default: 'createdAt',
        description: 'Field to order the agents by',
    },
    {
        displayName: 'Order Direction',
        name: 'orderDirection',
        type: 'options',
        options: [
            { name: 'Descending', value: 'DESC' },
            { name: 'Ascending', value: 'ASC' },
        ],
        default: 'DESC',
        description: 'Direction to order the agents by',
    },
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const qs: Record<string, any> = {};
    let responseDataInner: any;
    let responseDataOuter: any;

    const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;
    qs.query = this.getNodeParameter('query', itemIndex, undefined) as string | undefined;
    const agentType = this.getNodeParameter('agentType', itemIndex, undefined) as string | undefined;
    if (agentType) qs.type = agentType; // API expects 'type'
    qs.orderField = this.getNodeParameter('orderField', itemIndex, 'createdAt');
    qs.orderDirection = this.getNodeParameter('orderDirection', itemIndex, 'DESC');

    // Clean up undefined optional fields from qs
    Object.keys(qs).forEach(key => (qs[key] === undefined) && delete qs[key]);

    if (returnAll) {
        qs.limit = this.getNodeParameter('limit', itemIndex, 100); // Base limit for listAll
        qs.offset = this.getNodeParameter('offset', itemIndex, 0);
        responseDataInner = await octaveApiRequestListAll.call(this, 'GET', '/api/v2/agents/list', qs);
    } else {
        qs.limit = this.getNodeParameter('limit', itemIndex, 10) as number;
        qs.offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        responseDataOuter = await octaveApiRequest.call(this, 'GET', '/api/v2/agents/list', {}, qs);
        responseDataInner = responseDataOuter?.data;
    }

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || responseDataOuter || {}),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}