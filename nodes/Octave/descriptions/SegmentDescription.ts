import type { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a segment by OId',
				action: 'Get a segment',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List segments with optional filtering',
				action: 'List segments',
			},
		],
		default: 'list',
	},
];