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
        description: 'Text search query for products',
    },

    {
        displayName: 'Product OID (Filter)',
        name: 'productOId',
        type: 'string',
        default: '',
        description: 'Filter list by a specific Product OId (optional)',
    },
];

const displayOptions = {
    show: {
        resource: ['product'],
        operation: ['list'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const qs: Record<string, any> = {};
    let responseDataInner: any;

    const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;
    qs.text = this.getNodeParameter('text', itemIndex) as string | undefined;
    qs.productOId = this.getNodeParameter('productOId', itemIndex) as string | undefined;

    Object.keys(qs).forEach(key => (qs[key] === undefined) && delete qs[key]);

    if (returnAll) {
        qs.limit = this.getNodeParameter('limit', itemIndex, 100);
        qs.offset = this.getNodeParameter('offset', itemIndex, 0);
        responseDataInner = await octaveApiRequestListAll.call(this, 'GET', '/api/v2/product/list', qs); // Path assumed
    } else {
        qs.limit = this.getNodeParameter('limit', itemIndex, 50) as number;
        qs.offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        const responseDataOuter = await octaveApiRequest.call(this, 'GET', '/api/v2/product/list', {}, qs); // Path assumed
        responseDataInner = responseDataOuter?.data;
    }

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseDataInner || []),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}