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
                name: 'List',
                value: 'list',
                action: 'List use cases',
                description: 'List use cases in the workspace',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a use case',
                description: 'Get a specific use case by OId',
            },
        ],
        default: 'list',
    },
];