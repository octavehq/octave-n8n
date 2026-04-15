import type { INodeProperties } from 'n8n-workflow';

export const resourceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['resource'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new resource (text, file, URL, or Google Drive)',
				action: 'Create a resource',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete one or more resources',
				action: 'Delete resources',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a resource by OId',
				action: 'Get a resource',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List resources',
				action: 'List resources',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Semantic search across resources',
				action: 'Search resources',
			},
			{
				name: 'Status',
				value: 'status',
				description: 'Check the processing status of an async resource',
				action: 'Get resource status',
			},
		],
		default: 'list',
	},
];
