import type { INodeProperties } from 'n8n-workflow';

export const contextOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['context'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Fetch relevant context from the library, resources, and tools for a query',
				action: 'Search context',
			},
		],
		default: 'search',
	},
];
