import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Agent OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the agent to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{ name: '(Unchanged)', value: '' },
			{ name: 'Chorus', value: 'CHORUS' },
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
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Playbook Name or ID',
		name: 'playbookOId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getPlaybooks' },
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Persona OIds',
		name: 'personaOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated persona OIds',
	},
	{
		displayName: 'Use Case OIds',
		name: 'useCaseOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated use case OIds',
	},
	{
		displayName: 'Segment OIds',
		name: 'segmentOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated segment OIds',
	},
	{
		displayName: 'Competitor OIds',
		name: 'competitorOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated competitor OIds',
	},
	{
		displayName: 'Reference OIds',
		name: 'referenceOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated reference OIds',
	},
	{
		displayName: 'Proof Point OIds',
		name: 'proofPointOIds',
		type: 'string',
		default: '',
		description: 'Comma-separated proof point OIds',
	},
	{
		displayName: 'Sequence Settings (JSON)',
		name: 'sequenceSettings',
		type: 'json',
		default: '{}',
		description: 'EMAIL agents only — sequence-level settings',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Step Patches (JSON)',
		name: 'stepPatches',
		type: 'json',
		default: '{}',
		description: 'EMAIL agents only — partial email builder config per step index',
		typeOptions: { rows: 5 },
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
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

function csv(s: string): string[] | undefined {
	if (!s) return undefined;
	const arr = s.split(',').map(v => v.trim()).filter(Boolean);
	return arr.length > 0 ? arr : undefined;
}

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required.', { itemIndex });
	}

	const body: Record<string, any> = { oId };

	const optionalScalars = ['name', 'description', 'model', 'productOId', 'playbookOId'];
	for (const f of optionalScalars) {
		const v = this.getNodeParameter(f, itemIndex, '') as string;
		if (v) body[f] = v;
	}

	const arrFields = ['personaOIds', 'useCaseOIds', 'segmentOIds', 'competitorOIds', 'referenceOIds', 'proofPointOIds'];
	for (const f of arrFields) {
		const v = csv(this.getNodeParameter(f, itemIndex, '') as string);
		if (v) body[f] = v;
	}

	const ss = parseJsonParameter.call(this, 'sequenceSettings', itemIndex, '{}');
	if (ss && Object.keys(ss).length > 0) body.sequenceSettings = ss;
	const sp = parseJsonParameter.call(this, 'stepPatches', itemIndex, '{}');
	if (sp && Object.keys(sp).length > 0) body.stepPatches = sp;
	const data = parseJsonParameter.call(this, 'data', itemIndex, '{}');
	if (data && Object.keys(data).length > 0) body.data = data;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
