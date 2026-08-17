import { INodeProperties } from 'n8n-workflow';

export const personaOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['persona'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a persona',
                description: 'Create a new persona',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a persona',
                description: 'Delete a persona',
            },
            {
                name: 'Generate',
                value: 'generate',
                action: 'Generate personas',
                description: 'Generate personas from source materials using AI',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a persona',
                description: 'Get a specific persona by OId',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List personas',
                description: 'List personas in the workspace',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a persona',
                description: 'Update an existing persona',
            },
        ],
        default: 'list',
    },
];

