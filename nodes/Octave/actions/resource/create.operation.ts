import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Text', value: 'text', description: 'Create from plain text content (sync)' },
			{ name: 'File (Base64)', value: 'file', description: 'Create from base64 encoded file (sync)' },
			{ name: 'URL', value: 'url', description: 'Create from URL (async — poll status)' },
			{ name: 'Google Drive', value: 'drive', description: 'Create from Google Drive file ID (async)' },
		],
		default: 'text',
		description: 'How the resource will be created',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		default: '',
		description: 'The text content of the resource',
		typeOptions: { rows: 8 },
		displayOptions: { show: { mode: ['text'] } },
	},
	{
		displayName: 'File (Base64)',
		name: 'file',
		type: 'string',
		default: '',
		description: 'Base64 encoded file content',
		typeOptions: { rows: 4 },
		displayOptions: { show: { mode: ['file'] } },
	},
	{
		displayName: 'Filename',
		name: 'filename',
		type: 'string',
		default: '',
		description: 'Original filename including extension',
		displayOptions: { show: { mode: ['file'] } },
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'string',
		default: '',
		description: 'MIME type of the file (e.g. application/pdf)',
		displayOptions: { show: { mode: ['file'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'URL to crawl and index',
		displayOptions: { show: { mode: ['url'] } },
	},
	{
		displayName: 'Drive File ID',
		name: 'driveFileId',
		type: 'string',
		default: '',
		description: 'Google Drive file ID',
		displayOptions: { show: { mode: ['drive'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Display name for the resource (optional)',
	},
	{
		displayName: 'Metadata (JSON)',
		name: 'metadata',
		type: 'json',
		default: '{}',
		description: 'Optional metadata to attach to the resource',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['resource'],
		operation: ['create'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const mode = this.getNodeParameter('mode', itemIndex) as string;
	const body: Record<string, any> = { mode };

	if (mode === 'text') {
		body.text = this.getNodeParameter('text', itemIndex) as string;
		if (!body.text) throw new NodeOperationError(this.getNode(), 'Text is required for text mode.', { itemIndex });
	} else if (mode === 'file') {
		body.file = this.getNodeParameter('file', itemIndex) as string;
		body.filename = this.getNodeParameter('filename', itemIndex) as string;
		body.contentType = this.getNodeParameter('contentType', itemIndex) as string;
		if (!body.file || !body.filename || !body.contentType) {
			throw new NodeOperationError(this.getNode(), 'File, filename, and contentType are required for file mode.', { itemIndex });
		}
	} else if (mode === 'url') {
		body.url = this.getNodeParameter('url', itemIndex) as string;
		if (!body.url) throw new NodeOperationError(this.getNode(), 'URL is required for url mode.', { itemIndex });
	} else if (mode === 'drive') {
		body.driveFileId = this.getNodeParameter('driveFileId', itemIndex) as string;
		if (!body.driveFileId) throw new NodeOperationError(this.getNode(), 'Drive File ID is required for drive mode.', { itemIndex });
	}

	const name = this.getNodeParameter('name', itemIndex) as string;
	if (name) body.name = name;
	const metadata = parseJsonParameter.call(this, 'metadata', itemIndex, '{}');
	if (metadata && Object.keys(metadata).length > 0) body.metadata = metadata;

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/resource/create', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
