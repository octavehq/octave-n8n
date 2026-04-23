import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Brand Voice OId',
		name: 'brandVoiceOId',
		type: 'string',
		default: '',
		description: 'Optional brand voice to use for generation',
	},
	{
		displayName: 'Comparative Advantage Input',
		name: 'comparativeAdvantageInput',
		type: 'string',
		default: '',
		description: 'Input describing the comparative advantage (optional)',
	},
	{
		displayName: 'Likely Alternative Input',
		name: 'likelyAlternativeInput',
		type: 'string',
		default: '',
		description: 'Input describing the likely alternative (optional)',
	},
	{
		displayName: 'Service Generation Requests',
		name: 'services',
		type: 'collection',
		placeholder: 'Add Service',
		typeOptions: {
			multipleValues: true,
		},
		default: [{}],
		description: 'Array of service generation requests. Each generates one service.',
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Optional name for the service - if provided, will be used as the entity name',
				placeholder: 'Managed Analytics Onboarding',
			},
			{
				displayName: 'Sources',
				name: 'sources',
				type: 'fixedCollection',
				placeholder: 'Add Source',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Source materials to generate the service from (at least one required)',
				options: [
					{
						displayName: 'Source',
						name: 'source',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Text', value: 'TEXT', description: 'Text-based source material' },
									{ name: 'URL', value: 'URL', description: 'URL-based source material' },
								],
								default: 'TEXT',
								description: 'The type of source material',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The source content (text or URL)',
								placeholder: 'Onboarding engagement for enterprise customers',
								typeOptions: { rows: 3 },
							},
						],
					},
				],
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['service'],
		operation: ['generate'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.brandVoiceOId = this.getNodeParameter('brandVoiceOId', itemIndex) as string | undefined;
	body.comparativeAdvantageInput = this.getNodeParameter('comparativeAdvantageInput', itemIndex) as string | undefined;
	body.likelyAlternativeInput = this.getNodeParameter('likelyAlternativeInput', itemIndex) as string | undefined;

	const servicesRaw = this.getNodeParameter('services', itemIndex) as Array<{
		name?: string;
		sources: { source?: Array<{ type: 'TEXT' | 'URL'; value: string }> };
	}>;

	body.services = servicesRaw.map(service => ({
		name: service.name,
		sources: service.sources?.source || [],
	}));

	Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/service/generate', body);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	);
	return [executionData];
}
