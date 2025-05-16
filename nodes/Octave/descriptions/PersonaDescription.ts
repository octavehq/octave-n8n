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
                name: 'List',
                value: 'list',
                action: 'List personas',
                description: 'List personas in the workspace',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a persona',
                description: 'Get a specific persona by OId',
            },
        ],
        default: 'list',
    },
];

