import type { INodeProperties } from 'n8n-workflow';

export const motionIcpOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['motionIcp'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a Motion ICP cell by OId',
				action: 'Get a motion ICP',
			},
			{
				name: 'Get Learning',
				value: 'getLearning',
				description: 'Get a Motion ICP learning by OId',
				action: 'Get a motion ICP learning',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List Motion ICP cells for a motion',
				action: 'List motion ICP cells',
			},
			{
				name: 'List Elements',
				value: 'listElements',
				description: 'List recommended elements for a Motion ICP',
				action: 'List motion ICP elements',
			},
			{
				name: 'List Learnings',
				value: 'listLearnings',
				description: 'List learnings for a Motion ICP',
				action: 'List motion ICP learnings',
			},
		],
		default: 'list',
	},
];
