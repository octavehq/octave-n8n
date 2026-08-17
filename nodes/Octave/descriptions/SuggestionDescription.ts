import type { INodeProperties } from 'n8n-workflow';

export const suggestionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['suggestion'],
			},
		},
		options: [
			{
				name: 'Accept',
				value: 'accept',
				description: 'Accept a pending suggestion',
				action: 'Accept a suggestion',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new suggestion',
				action: 'Create a suggestion',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a suggestion by OId',
				action: 'Get a suggestion',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List suggestions with optional filtering',
				action: 'List suggestions',
			},
			{
				name: 'Reject',
				value: 'reject',
				description: 'Reject a pending suggestion',
				action: 'Reject a suggestion',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Revise a pending suggestion',
				action: 'Update a suggestion',
			},
		],
		default: 'list',
	},
];
