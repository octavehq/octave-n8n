import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		description: 'The name/title of the brand voice',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		required: true,
		default: '',
		description: 'High-level description of this brand voice',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Essence',
		name: 'essence',
		type: 'string',
		default: '',
		description: 'The core essence or soul of the brand voice (optional)',
		typeOptions: { rows: 2 },
	},
	{
		displayName: 'Personality (JSON)',
		name: 'personality',
		type: 'json',
		required: true,
		default: '{\n  "coreTraits": [],\n  "guidingPrinciples": []\n}',
		description: 'Brand personality definition with coreTraits and guidingPrinciples (string arrays)',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Tonality (JSON)',
		name: 'tonality',
		type: 'json',
		required: true,
		default: '{\n  "soundLike": [],\n  "neverSoundLike": []\n}',
		description: 'Brand tonality with soundLike and neverSoundLike (string arrays)',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Vocabulary (JSON)',
		name: 'vocabulary',
		type: 'json',
		required: true,
		default: '{\n  "keyCompanyTerms": [],\n  "keySubstitutions": []\n}',
		description: 'Vocabulary with keyCompanyTerms and keySubstitutions (string arrays)',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Writing Rules (JSON)',
		name: 'writingRules',
		type: 'json',
		required: true,
		default: '{\n  "languageRules": [],\n  "formattingFundamentals": []\n}',
		description: 'Writing rules with languageRules and formattingFundamentals (string arrays)',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Audience Considerations (JSON)',
		name: 'audienceConsiderations',
		type: 'json',
		required: true,
		default: '{\n  "qualitiesAndCharacteristics": [],\n  "aspirationsAndBoundaries": []\n}',
		description: 'Audience qualitiesAndCharacteristics and aspirationsAndBoundaries (string arrays)',
		typeOptions: { rows: 5 },
	},
];

const displayOptions = {
	show: {
		resource: ['brandVoice'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {
		title: this.getNodeParameter('title', itemIndex) as string,
		description: this.getNodeParameter('description', itemIndex) as string,
		personality: parseJsonParameter.call(this, 'personality', itemIndex, '{}'),
		tonality: parseJsonParameter.call(this, 'tonality', itemIndex, '{}'),
		vocabulary: parseJsonParameter.call(this, 'vocabulary', itemIndex, '{}'),
		writingRules: parseJsonParameter.call(this, 'writingRules', itemIndex, '{}'),
		audienceConsiderations: parseJsonParameter.call(this, 'audienceConsiderations', itemIndex, '{}'),
	};

	const essence = this.getNodeParameter('essence', itemIndex) as string;
	if (essence) body.essence = essence;

	if (!body.title || !body.description) {
		throw new NodeOperationError(this.getNode(), 'Title and Description are required.', { itemIndex });
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/brand-voice/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
