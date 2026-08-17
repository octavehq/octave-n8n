import type { INodeProperties } from 'n8n-workflow';

export const reportGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reportGroup'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a report group by OId',
				action: 'Get a report group',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List report groups',
				action: 'List report groups',
			},
		],
		default: 'list',
	},
];
