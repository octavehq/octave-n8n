import type { INodeProperties } from 'n8n-workflow';

export const serviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['service'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new service',
				action: 'Create a service',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a service',
				action: 'Delete a service',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a service from source materials using AI',
				action: 'Generate a service',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a service by OId',
				action: 'Get a service',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List services with optional filtering',
				action: 'List services',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing service',
				action: 'Update a service',
			},
		],
		default: 'list',
	},
];
