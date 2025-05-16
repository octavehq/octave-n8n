import { INodeProperties } from 'n8n-workflow';

export const playbookOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['playbook'],
            },
        },
        options: [
            {
                name: 'List Playbooks',
                value: 'list',
                action: 'List playbooks',
            },
            {
                name: 'Get Playbook',
                value: 'get',
                action: 'Get a playbook by OID',
            },
            {
                name: 'Create Playbook',
                value: 'create',
                action: 'Create a new playbook',
            },
        ],
        default: 'list',
    },
];
