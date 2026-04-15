import type { INodeProperties } from 'n8n-workflow';

export const brandVoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['brandVoice'],
			},
		},
		options: [
			{
				name: 'Apply',
				value: 'apply',
				description: 'Apply a brand voice to source materials',
				action: 'Apply a brand voice',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new brand voice',
				action: 'Create a brand voice',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a brand voice from source materials using AI',
				action: 'Generate a brand voice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a brand voice by OId',
				action: 'Get a brand voice',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List brand voices',
				action: 'List brand voices',
			},
			{
				name: 'Toggle Default',
				value: 'toggleDefault',
				description: 'Toggle a brand voice as the workspace default',
				action: 'Toggle default brand voice',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing brand voice',
				action: 'Update a brand voice',
			},
		],
		default: 'list',
	},
];
