import type { INodeProperties } from 'n8n-workflow';

export const alternativeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alternative'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new alternative',
				action: 'Create an alternative',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an alternative',
				action: 'Delete an alternative',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate alternatives from source materials using AI',
				action: 'Generate alternatives',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an alternative by OId',
				action: 'Get an alternative',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List alternatives with optional filtering',
				action: 'List alternatives',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing alternative',
				action: 'Update an alternative',
			},
		],
		default: 'list',
	},
];
