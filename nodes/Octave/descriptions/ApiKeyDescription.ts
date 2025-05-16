import { INodeProperties } from 'n8n-workflow';

export const apiKeyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['apiKey'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List API keys',
				description: 'List API keys',
			},
		],
		default: 'list',
	},
];