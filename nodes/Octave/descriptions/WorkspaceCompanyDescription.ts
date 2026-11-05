import type { INodeProperties } from 'n8n-workflow';

export const workspaceCompanyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workspaceCompany'],
			},
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate the workspace company from a domain or sources using AI',
				action: 'Generate the workspace company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get the workspace company',
				action: 'Get the workspace company',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the workspace company',
				action: 'Update the workspace company',
			},
		],
		default: 'get',
	},
];
