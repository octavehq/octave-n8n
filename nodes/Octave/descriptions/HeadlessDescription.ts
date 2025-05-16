import { INodeProperties } from 'n8n-workflow';

export const headlessOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['headless'],
            },
        },
        options: [
            {
                name: 'Generate Emails',
                value: 'generateEmails',
                action: 'Generate emails headlessly',
                description: 'Triggers email generation via the headless service using detailed inputs',
            },
        ],
        default: 'generateEmails',
    },
];