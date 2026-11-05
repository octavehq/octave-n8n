import type { INodeProperties } from 'n8n-workflow';

export const competitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['competitor'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new competitor',
				action: 'Create a competitor',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a competitor',
				action: 'Delete a competitor',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate competitors from source materials using AI',
				action: 'Generate competitors',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a competitor by OId',
				action: 'Get a competitor',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List competitors with optional filtering',
				action: 'List competitors',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing competitor',
				action: 'Update a competitor',
			},
		],
		default: 'list',
	},
];