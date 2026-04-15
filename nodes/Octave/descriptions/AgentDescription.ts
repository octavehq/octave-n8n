import { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['agent'],
            },
        },
        options: [
            {
                name: 'Build Workspace',
                value: 'buildWorkspace',
                action: 'Build workspace',
                description: 'Generate and build a Workspace',
            },
            {
                name: 'Call Prep',
                value: 'callPrep',
                action: 'Generate call prep',
                description: 'Generate call prep content including discovery questions, call scripts, and objection handling',
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create an agent',
                description: 'Create a new agent',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete an agent',
                description: 'Delete an agent by OId',
            },
            {
                name: 'Enrich Company',
                value: 'enrichCompany',
                action: 'Enrich a company',
                description: 'Enrich a company',
            },
            {
                name: 'Enrich Person',
                value: 'enrichPerson',
                action: 'Enrich a person',
                description: 'Enrich a Person',
            },
            {
                name: 'Generate Content',
                value: 'generateContent',
                action: 'Generate content',
                description: 'Generate content for a person',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get an agent',
                description: 'Get an agent by OId',
            },
            {
                name: 'Languages',
                value: 'languages',
                action: 'List supported languages',
                description: 'List the languages supported by agents',
            },
            {
                name: 'List',
                value: 'list',
                action: 'List agents',
                description: 'List all agents',
            },
            {
                name: 'Qualify Company',
                value: 'qualifyCompany',
                action: 'Qualify a company',
                description: 'Determine if a company is qualified for a given Product and/or Segment',
            },
            {
                name: 'Qualify Person',
                value: 'qualifyPerson',
                action: 'Qualify a person',
                description: 'Determine if a person is qualified for a given Product, Persona, and/or Segment',
            },
            {
                name: 'Run Context',
                value: 'runContext',
                action: 'Run a context agent',
                description: 'Fetch context using a CONTEXT-type agent',
            },
            {
                name: 'Run Prospector',
                value: 'runProspector',
                action: 'Run a prospector agent',
                description: 'Find relevant people at a company or lookalike companies',
            },
            {
                name: 'Run Sequence',
                value: 'runSequence',
                action: 'Run a sequence agent',
                description: 'Generate Emails for a person',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update an agent',
                description: 'Update an existing agent',
            },
        ],
        default: 'list',
    },
];
