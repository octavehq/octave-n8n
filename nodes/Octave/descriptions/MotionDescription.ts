import type { INodeProperties } from 'n8n-workflow';

export const motionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['motion'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new motion',
				action: 'Create a motion',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a motion',
				action: 'Delete a motion',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a motion by OId',
				action: 'Get a motion',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List motions with optional filtering',
				action: 'List motions',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing motion',
				action: 'Update a motion',
			},
		],
		default: 'list',
	},
];
