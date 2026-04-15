import type { INodeProperties } from 'n8n-workflow';

export const buyingTriggerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['buyingTrigger'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new buying trigger',
				action: 'Create a buying trigger',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a buying trigger',
				action: 'Delete a buying trigger',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate buying triggers from source materials using AI',
				action: 'Generate buying triggers',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a buying trigger by OId',
				action: 'Get a buying trigger',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List buying triggers with optional filtering',
				action: 'List buying triggers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing buying trigger',
				action: 'Update a buying trigger',
			},
		],
		default: 'list',
	},
];
