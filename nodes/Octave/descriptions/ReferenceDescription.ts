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
                name: 'List',
                value: 'list',
                action: 'List references',
                description: 'List references in the workspace',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a reference',
                description: 'Get a specific reference by OId',
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a reference',
                description: 'Create a new reference',
            },
        ],
        default: 'list',
    },
];