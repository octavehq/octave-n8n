import type { INodeProperties } from 'n8n-workflow';

export const coreFeatureOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['coreFeature'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new core feature',
				action: 'Create a core feature',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a core feature',
				action: 'Delete a core feature',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate core features from source materials using AI',
				action: 'Generate core features',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a core feature by OId',
				action: 'Get a core feature',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List core features with optional filtering',
				action: 'List core features',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing core feature',
				action: 'Update a core feature',
			},
		],
		default: 'list',
	},
];
