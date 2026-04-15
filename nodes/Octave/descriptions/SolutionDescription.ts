import type { INodeProperties } from 'n8n-workflow';

export const solutionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['solution'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new solution',
				action: 'Create a solution',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a solution',
				action: 'Delete a solution',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a solution from source materials using AI',
				action: 'Generate a solution',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a solution by OId',
				action: 'Get a solution',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List solutions with optional filtering',
				action: 'List solutions',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing solution',
				action: 'Update a solution',
			},
		],
		default: 'list',
	},
];
