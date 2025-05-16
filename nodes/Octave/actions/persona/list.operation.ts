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
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        default: 0,
        description: 'Offset of the results to return',
    },
    {
        displayName: 'Text Search',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Text search query for personas',
    },
    {
        displayName: 'Query Type',
        name: 'queryType',
        type: 'options',
        options: [
            { name: 'All', value: 'ALL' },
            { name: 'Team', value: 'TEAM' },
            { name: 'Mine', value: 'MINE' },
        ],
        default: 'ALL',
        description: 'Type of query to perform',
    },
    {
        displayName: 'Product OID (Filter)',
        name: 'productOId',
        type: 'string',
        default: '',
        description: 'Filter list by a specific Product OId (optional)',
    },
    {
        displayName: 'Playbook OID (Filter)',
        name: 'playbookOId',
        type: 'string',
        default: '',
        description: 'Filter list by a specific Playbook OId (optional)',
    },
];

const displayOptions = {
    show: {
        resource: ['persona'],
        operation: ['list'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const qs: Record<string, any> = {};
    let responseDataInner: any;

    const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;
    qs.text = this.getNodeParameter('text', itemIndex) as string | undefined;
    qs.queryType = this.getNodeParameter('queryType', itemIndex, 'ALL') as string;
    qs.productOId = this.getNodeParameter('productOId', itemIndex) as string | undefined;
    qs.playbookOId = this.getNodeParameter('playbookOId', itemIndex) as string | undefined;

    Object.keys(qs).forEach(key => (qs[key] === undefined) && delete qs[key]);

    if (returnAll) {
        qs.limit = this.getNodeParameter('limit', itemIndex, 100);
        qs.offset = this.getNodeParameter('offset', itemIndex, 0);
        responseDataInner = await octaveApiRequestListAll.call(this, 'GET', '/api/v2/persona/list', qs);
    } else {
        qs.limit = this.getNodeParameter('limit', itemIndex, 50) as number;
        qs.offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        const responseDataOuter = await octaveApiRequest.call(this, 'GET', '/api/v2/persona/list', {}, qs);
        responseDataInner = responseDataOuter?.data;
    }

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || []),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}