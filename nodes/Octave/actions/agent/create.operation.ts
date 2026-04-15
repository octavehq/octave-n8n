import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the agent',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		required: true,
		default: '',
		description: 'The description of the agent',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		options: [
			{ name: 'Call Prep', value: 'CALL_PREP' },
			{ name: 'Content', value: 'CONTENT' },
			{ name: 'Context', value: 'CONTEXT' },
			{ name: 'Email', value: 'EMAIL' },
			{ name: 'Enrich Company', value: 'ENRICH_COMPANY' },
			{ name: 'Enrich Person', value: 'ENRICH_PERSON' },
			{ name: 'Prospector', value: 'PROSPECTOR' },
			{ name: 'Qualify Company', value: 'QUALIFY_COMPANY' },
			{ name: 'Qualify Person', value: 'QUALIFY_PERSON' },
		],
		default: 'EMAIL',
		description: 'The type of agent to create',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{ name: 'Chorus', value: 'CHORUS' },
			{ name: 'Default', value: '' },
			{ name: 'Echo', value: 'ECHO' },
			{ name: 'Harmony', value: 'HARMONY' },
			{ name: 'Note', value: 'NOTE' },
			{ name: 'Pulse', value: 'PULSE' },
			{ name: 'Symphony', value: 'SYMPHONY' },
		],
		default: '',
	},
	{
		displayName: 'Product Name or ID',
		name: 'productOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProducts' },
		default: '',
		description: 'Product/offering to associate with the agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Playbook Name or ID',
		name: 'playbookOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getPlaybooks' },
		default: '',
		description: 'Playbook to associate with the agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Persona OIds',
		name: 'personaOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated persona OIds to associate',
	},
	{
		displayName: 'Use Case OIds',
		name: 'useCaseOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated use case OIds to associate',
	},
	{
		displayName: 'Segment OIds',
		name: 'segmentOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated segment OIds to associate',
	},
	{
		displayName: 'Competitor OIds',
		name: 'competitorOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated competitor OIds to associate',
	},
	{
		displayName: 'Reference OIds',
		name: 'referenceOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated reference OIds to associate',
	},
	{
		displayName: 'Proof Point OIds',
		name: 'proofPointOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated proof point OIds to associate',
	},
	{
		displayName: 'Enable Brand Voice',
		name: 'enableBrandVoice',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Enable Web Search',
		name: 'enableWebSearch',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Web Search Instructions',
		name: 'webSearchInstructions',
		type: 'string',
		default: '',
		typeOptions: { rows: 2 },
		displayOptions: { show: { enableWebSearch: [true] } },
	},
	{
		displayName: 'Enable CRM Activity',
		name: 'enableCrmActivity',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'CRM Activity Instructions',
		name: 'crmActivityInstructions',
		type: 'string',
		default: '',
		typeOptions: { rows: 2 },
		displayOptions: { show: { enableCrmActivity: [true] } },
	},
	{
		displayName: 'Enable High-Effort Mode',
		name: 'enableHighEffortMode',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Sequence Settings (JSON)',
		name: 'sequenceSettings',
		type: 'json',
		default: '{}',
		description: 'EMAIL agents only — sequenceType, numEmails, tone, readingLevel, etc',
		typeOptions: { rows: 5 },
		displayOptions: { show: { type: ['EMAIL'] } },
	},
	{
		displayName: 'Step Patches (JSON)',
		name: 'stepPatches',
		type: 'json',
		default: '{}',
		description: 'EMAIL agents only — map of 1-based step index to partial email builder config',
		typeOptions: { rows: 5 },
		displayOptions: { show: { type: ['EMAIL'] } },
	},
	{
		displayName: 'Call Prep Methodology',
		name: 'callPrepMethodology',
		type: 'options',
		options: [
			{ name: 'AIDA', value: 'AIDA' },
			{ name: 'BANT', value: 'BANT' },
			{ name: 'Challenger', value: 'CHALLENGER' },
			{ name: 'CHAMP', value: 'CHAMP' },
			{ name: 'Default', value: '' },
			{ name: 'MEDDIC', value: 'MEDDIC' },
			{ name: 'NEAT', value: 'NEAT' },
			{ name: 'Sandler', value: 'SANDLER' },
			{ name: 'SPICED', value: 'SPICED' },
			{ name: 'SPIN', value: 'SPIN' },
			{ name: 'Why Change', value: 'WHY_CHANGE' },
		],
		default: '',
		displayOptions: { show: { type: ['CALL_PREP'] } },
	},
	{
		displayName: 'Instructions',
		name: 'instructions',
		type: 'string',
		default: '',
		description: 'Instructions for content generation (CONTENT agents only)',
		typeOptions: { rows: 4 },
		displayOptions: { show: { type: ['CONTENT'] } },
	},
	{
		displayName: 'Examples (JSON Array)',
		name: 'examples',
		type: 'json',
		default: '[]',
		description: 'Example outputs for content generation (CONTENT agents only)',
		typeOptions: { rows: 3 },
		displayOptions: { show: { type: ['CONTENT'] } },
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		options: [
			{ name: 'Default', value: '' },
			{ name: 'HTML', value: 'HTML' },
			{ name: 'JSON', value: 'JSON' },
			{ name: 'Markdown', value: 'MARKDOWN' },
			{ name: 'Text', value: 'TEXT' },
		],
		default: '',
		displayOptions: { show: { type: ['CONTENT'] } },
	},
	{
		displayName: 'JSON Schema Instructions',
		name: 'jsonSchemaInstructions',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
		displayOptions: { show: { type: ['CONTENT'], outputFormat: ['JSON'] } },
	},
	{
		displayName: 'Data Passthrough (JSON)',
		name: 'data',
		type: 'json',
		default: '{}',
		description: 'Full agent configuration data passthrough (merged with other fields)',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

function csv(s: string): string[] | undefined {
	if (!s) return undefined;
	const arr = s.split(',').map(v => v.trim()).filter(Boolean);
	return arr.length > 0 ? arr : undefined;
}

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {
		name: this.getNodeParameter('name', itemIndex) as string,
		description: this.getNodeParameter('description', itemIndex) as string,
		type: this.getNodeParameter('type', itemIndex) as string,
	};

	if (!body.name || !body.description || !body.type) {
		throw new NodeOperationError(this.getNode(), 'Name, description, and type are required.', { itemIndex });
	}

	const optionalScalars = ['model', 'productOId', 'playbookOId', 'webSearchInstructions', 'crmActivityInstructions', 'callPrepMethodology', 'instructions', 'outputFormat', 'jsonSchemaInstructions'];
	for (const f of optionalScalars) {
		const v = this.getNodeParameter(f, itemIndex, '') as string;
		if (v) body[f] = v;
	}

	const arrFields = ['personaOIds', 'useCaseOIds', 'segmentOIds', 'competitorOIds', 'referenceOIds', 'proofPointOIds'];
	for (const f of arrFields) {
		const v = csv(this.getNodeParameter(f, itemIndex, '') as string);
		if (v) body[f] = v;
	}

	const boolFields = ['enableBrandVoice', 'enableWebSearch', 'enableCrmActivity', 'enableHighEffortMode'];
	for (const f of boolFields) {
		body[f] = this.getNodeParameter(f, itemIndex, false) as boolean;
	}

	if (body.type === 'EMAIL') {
		const ss = parseJsonParameter.call(this, 'sequenceSettings', itemIndex, '{}');
		if (ss && Object.keys(ss).length > 0) body.sequenceSettings = ss;
		const sp = parseJsonParameter.call(this, 'stepPatches', itemIndex, '{}');
		if (sp && Object.keys(sp).length > 0) body.stepPatches = sp;
	}

	if (body.type === 'CONTENT') {
		const ex = parseJsonParameter.call(this, 'examples', itemIndex, '[]');
		if (Array.isArray(ex) && ex.length > 0) body.examples = ex;
	}

	const data = parseJsonParameter.call(this, 'data', itemIndex, '{}');
	if (data && Object.keys(data).length > 0) body.data = data;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
