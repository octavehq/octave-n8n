import { INodeProperties } from 'n8n-workflow';

export const useCaseOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['useCase'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a use case',
                description: 'Create a new use case',
            },
            {
                name: 'Generate',
                value: 'generate',
                action: 'Generate use cases',
                description: 'Generate use cases from source materials using AI',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a use case',
                description: 'Get a specific use case by OId',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List use cases',
                description: 'List use cases in the workspace',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a use case',
                description: 'Update an existing use case',
            },
        ],
        default: 'list',
    },
];