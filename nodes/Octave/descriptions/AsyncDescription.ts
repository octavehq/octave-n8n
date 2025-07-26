import { INodeProperties } from 'n8n-workflow';

export const asyncOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['async'],
            },
        },
        options: [
            {
                name: 'Run Agent',
                value: 'runAgent',
                action: 'Run an agent asynchronously',
                description: 'Triggers an agent to run in the background',
            }
        ],
        default: 'runAgent',
    },
];