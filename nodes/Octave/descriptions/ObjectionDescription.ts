import type { INodeProperties } from 'n8n-workflow';

export const objectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['objection'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new objection',
				action: 'Create an objection',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an objection',
				action: 'Delete an objection',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate objections from source materials using AI',
				action: 'Generate objections',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an objection by OId',
				action: 'Get an objection',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List objections with optional filtering',
				action: 'List objections',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing objection',
				action: 'Update an objection',
			},
		],
		default: 'list',
	},
];
