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
                name: 'Create',
                value: 'create',
                action: 'Create a product',
                description: 'Create a new product',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a product',
                description: 'Delete a product',
            },
            {
                name: 'Generate',
                value: 'generate',
                action: 'Generate products',
                description: 'Generate products from source materials using AI',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a product',
                description: 'Get a specific product by OId',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List products',
                description: 'List products in the workspace',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a product',
                description: 'Update an existing product',
            },
        ],
        default: 'list',
    },
];

// export const productFields: INodeProperties[] = [
// ... (removed content)
// ];