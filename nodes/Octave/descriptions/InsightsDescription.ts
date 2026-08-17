import type { INodeProperties } from 'n8n-workflow';

export const insightsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['insights'],
			},
		},
		options: [
			{
				name: 'Competitive Landscape',
				value: 'competitive',
				description: 'Get the competitive landscape for a period',
				action: 'Get competitive landscape insights',
			},
			{
				name: 'Entity Stats',
				value: 'entityStats',
				description: 'Get stats for a specific entity',
				action: 'Get entity stats',
			},
			{
				name: 'Entity Time Series',
				value: 'entityTimeSeries',
				description: 'Get a time series for a specific entity',
				action: 'Get entity time series',
			},
			{
				name: 'Library Health',
				value: 'libraryHealth',
				description: 'Get library health for a period',
				action: 'Get library health insights',
			},
			{
				name: 'Top Entities',
				value: 'topEntities',
				description: 'Get top entities for a period',
				action: 'Get top entities',
			},
			{
				name: 'Workspace Baseline',
				value: 'workspaceBaseline',
				description: 'Get the workspace baseline',
				action: 'Get workspace baseline',
			},
		],
		default: 'libraryHealth',
	},
];
