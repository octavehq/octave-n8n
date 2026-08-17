import type { INodeProperties } from 'n8n-workflow';

export const reportConfigOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reportConfig'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a report config by OId',
				action: 'Get a report config',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List report configs',
				action: 'List report configs',
			},
		],
		default: 'list',
	},
];
