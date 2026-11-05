import type { INodeProperties } from 'n8n-workflow';

export const findingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['finding'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List findings with optional filtering',
				action: 'List findings',
			},
		],
		default: 'list',
	},
];
