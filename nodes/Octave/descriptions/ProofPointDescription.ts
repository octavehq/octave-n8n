import { INodeProperties } from 'n8n-workflow';

export const proofPointDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['proofPoint'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a proof point',
				description: 'Create a new proof point',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a proof point',
				description: 'Delete a proof point',
			},
			{
				name: 'Generate',
				value: 'generate',
				action: 'Generate proof points',
				description: 'Generate proof points from source materials using AI',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a proof point',
				description: 'Get a proof point by OId',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List proof points',
				description: 'List proof points with optional filtering and pagination',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a proof point',
				description: 'Update an existing proof point',
			},
		],
		default: 'list',
	},
];