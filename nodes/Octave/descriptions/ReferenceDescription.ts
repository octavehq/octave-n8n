import { INodeProperties } from 'n8n-workflow';

export const referenceOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['reference'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a reference',
                description: 'Create a new reference',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a reference',
                description: 'Delete a reference',
            },
            {
                name: 'Generate',
                value: 'generate',
                action: 'Generate references',
                description: 'Generate references from source materials using AI',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a reference',
                description: 'Get a specific reference by OId',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List references',
                description: 'List references in the workspace',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a reference',
                description: 'Update an existing reference',
            },
        ],
        default: 'list',
    },
];