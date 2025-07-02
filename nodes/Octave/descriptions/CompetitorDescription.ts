import type { INodeProperties } from 'n8n-workflow';

export const competitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['competitor'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a competitor by OId',
				action: 'Get a competitor',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List competitors with optional filtering',
				action: 'List competitors',
			},
		],
		default: 'list',
	},
];