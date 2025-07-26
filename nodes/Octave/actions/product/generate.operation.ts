import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Status Quo Input',
        name: 'statusQuoInput',
        type: 'string',
        default: '',
        description: 'Input describing the current status quo (optional)',
    },
    {
        displayName: 'Differentiated Value Input',
        name: 'differentiatedValueInput',
        type: 'string',
        default: '',
        description: 'Input describing the differentiated value (optional)',
    },
    {
        displayName: 'Product Generation Requests',
        name: 'products',
        type: 'collection',
        placeholder: 'Add Product',
        typeOptions: {
            multipleValues: true,
        },
        default: [{}],
        description: 'Array of product generation requests. Each generates one product.',
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Optional name for the product - if provided, will be used as the entity name',
                placeholder: 'AI-Powered Sales Platform'
            },
            {
                displayName: 'Sources',
                name: 'sources',
                type: 'collection',
                placeholder: 'Add Source',
                typeOptions: {
                    multipleValues: true,
                },
                default: [{}],
                description: 'Source materials to generate the product from (at least one required)',
                options: [
                    {
                        displayName: 'Type',
                        name: 'type',
                        type: 'options',
                        options: [
                            {
                                name: 'Text',
                                value: 'TEXT',
                                description: 'Text-based source material'
                            },
                            {
                                name: 'URL',
                                value: 'URL',
                                description: 'URL-based source material'
                            }
                        ],
                        default: 'TEXT',
                        description: 'The type of source material'
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'The source content (text or URL)',
                        placeholder: 'Lead generation and qualification for enterprise sales',
                        typeOptions: {
                            rows: 3
                        }
                    }
                ]
            }
        ]
    }
];

const displayOptions = {
    show: {
        resource: ['product'],
        operation: ['generate'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.statusQuoInput = this.getNodeParameter('statusQuoInput', itemIndex) as string | undefined;
    body.differentiatedValueInput = this.getNodeParameter('differentiatedValueInput', itemIndex) as string | undefined;
    body.products = this.getNodeParameter('products', itemIndex) as Array<{
        name?: string;
        sources: Array<{ type: 'TEXT' | 'URL'; value: string }>;
    }>;

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/product/generate', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}