import type { INodeProperties } from 'n8n-workflow';

export const motionPlaybookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['motionPlaybook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new motion playbook',
				action: 'Create a motion playbook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a motion playbook',
				action: 'Delete a motion playbook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a motion playbook by OId',
				action: 'Get a motion playbook',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List motion playbooks with optional filtering',
				action: 'List motion playbooks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing motion playbook',
				action: 'Update a motion playbook',
			},
		],
		default: 'list',
	},
];
