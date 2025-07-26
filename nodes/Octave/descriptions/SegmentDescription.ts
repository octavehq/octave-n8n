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
				name: 'Create',
				value: 'create',
				description: 'Create a new segment',
				action: 'Create a segment',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate segments from source materials using AI',
				action: 'Generate segments',
			},
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
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing segment',
				action: 'Update a segment',
			},
		],
		default: 'list',
	},
];