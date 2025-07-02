import type { INodeProperties } from 'n8n-workflow';

export const experimentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['experiment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new agent experiment',
				action: 'Create an experiment',
			},
		],
		default: 'create',
	},
];