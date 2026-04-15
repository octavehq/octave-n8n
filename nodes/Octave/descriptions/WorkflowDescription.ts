import type { INodeProperties } from 'n8n-workflow';

export const workflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				name: 'Run',
				value: 'run',
				description: 'Trigger a workflow run',
				action: 'Run a workflow',
			},
			{
				name: 'Run Status',
				value: 'runStatus',
				description: 'Check the status of a workflow run',
				action: 'Get workflow run status',
			},
		],
		default: 'run',
	},
];
