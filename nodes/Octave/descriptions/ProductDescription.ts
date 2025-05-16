import { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['product'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                action: 'List products',
                description: 'List products in the workspace',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a product',
                description: 'Get a specific product by OId',
            },
        ],
        default: 'list',
    },
];

// export const productFields: INodeProperties[] = [
// ... (removed content)
// ];