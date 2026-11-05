import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Motion Playbook OId',
		name: 'oId',
		type: 'string',
		required: true,
		default: '',
		description: 'The OId of the motion playbook to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New playbook name (optional)',
	},
	{
		displayName: 'Set Active State',
		name: 'setActive',
		type: 'options',
		options: [
			{ name: 'Keep Current', value: 'keep' },
			{ name: 'Active', value: 'active' },
			{ name: 'Inactive', value: 'inactive' },
		],
		default: 'keep',
		description: 'Whether to change the active state of the playbook',
	},
	{
		displayName: 'Motion Framing',
		name: 'motionFraming',
		type: 'string',
		default: '',
		description: 'Updated motion framing narrative (optional)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Key Messaging (JSON Array)',
		name: 'keyMessaging',
		type: 'json',
		default: '',
		description: 'JSON array of updated key messaging points (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Key Positioning (JSON Array)',
		name: 'keyPositioning',
		type: 'json',
		default: '',
		description: 'JSON array of updated key positioning points (optional, leave empty to keep current)',
		typeOptions: { rows: 3 },
	},
];

const displayOptions = {
	show: {
		resource: ['motionPlaybook'],
		operation: ['update'],
	},
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
	const body: Record<string, any> = {};

	body.oId = this.getNodeParameter('oId', itemIndex) as string;
	if (!body.oId) {
		throw new NodeOperationError(this.getNode(), 'OId is required to update a motion playbook.', { itemIndex });
	}

	const name = this.getNodeParameter('name', itemIndex) as string;
	if (name) body.name = name;

	const setActive = this.getNodeParameter('setActive', itemIndex) as string;
	if (setActive === 'active') body.active = true;
	if (setActive === 'inactive') body.active = false;

	const motionFraming = this.getNodeParameter('motionFraming', itemIndex) as string;
	if (motionFraming) body.motionFraming = motionFraming;

	for (const field of ['keyMessaging', 'keyPositioning']) {
		const raw = this.getNodeParameter(field, itemIndex, '') as string;
		if (raw && raw.trim() !== '') {
			body[field] = parseJsonParameter.call(this, field, itemIndex, '[]');
		}
	}

	const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/motion-playbook/update', body);

	return [this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: itemIndex } },
	)];
}
