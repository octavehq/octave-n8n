import type { INodeProperties } from 'n8n-workflow';

export const reportRunOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reportRun'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a report run by OId',
				action: 'Get a report run',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List report runs for a config',
				action: 'List report runs',
			},
		],
		default: 'list',
	},
];
