import type { INodeProperties } from 'n8n-workflow';

export const revisionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['revision'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a revision by OId',
				action: 'Get a revision',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List revisions with optional filtering',
				action: 'List revisions',
			},
		],
		default: 'list',
	},
];
