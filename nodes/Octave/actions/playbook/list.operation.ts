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
        displayOptions: { show: { returnAll: [false] } },
        typeOptions: { minValue: 1 },
        default: 50,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        displayOptions: { show: { returnAll: [false] } }, // Also show if not returnAll
        typeOptions: { minValue: 0 },
        default: 0,
        description: 'Offset for pagination',
    },
    {
        displayName: 'Text Search',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Text to search for in playbooks (optional)',
    },
    {
        displayName: 'Query Type',
        name: 'queryType',
        type: 'options',
        options: [
            { name: 'All', value: 'ALL'},
            { name: 'Team', value: 'TEAM'},
            { name: 'Mine', value: 'MINE'},
        ],
        default: 'ALL',
        description: 'Scope of the playbook search (optional)',
    },
    {
        displayName: 'Product OId (Filter)',
        name: 'productOId',
        type: 'string',
        default: '',
        description: 'Filter by Product OId (optional)',
    },
];

const displayOptions = {
	show: {
		resource: ['playbook'],
		operation: ['list'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const qs: Record<string, any> = {};
    let responseDataInner: any;
    let responseDataOuter: any;

    const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;
    qs.text = this.getNodeParameter('text', itemIndex) as string | undefined;
    qs.productOId = this.getNodeParameter('productOId', itemIndex) as string | undefined;

    Object.keys(qs).forEach(key => (qs[key] === undefined) && delete qs[key]);

    if (returnAll) {
        qs.limit = this.getNodeParameter('limit', itemIndex, 100);
        qs.offset = this.getNodeParameter('offset', itemIndex, 0);
        responseDataInner = await octaveApiRequestListAll.call(this, 'GET', '/api/v2/playbook/list', qs);
    } else {
        qs.limit = this.getNodeParameter('limit', itemIndex, 10) as number;
        qs.offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        responseDataOuter = await octaveApiRequest.call(this, 'GET', '/api/v2/playbook/list', {}, qs);
        responseDataInner = responseDataOuter?.data;
    }

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || responseDataOuter || {}),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}