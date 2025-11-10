import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Primary Offering Name or ID',
        name: 'primaryOfferingOId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: '',
        description: 'Primary offering to associate with generated use cases (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        hint: "Primary Offering to use as context when generating use cases. If not provided, the primary company attached to the Workspace will be used."
    },
    {
        displayName: 'Use Case Generation Requests',
        name: 'useCases',
        type: 'collection',
        placeholder: 'Add Use Case',
        typeOptions: {
            multipleValues: true,
        },
        default: [{}],
        description: 'Array of use case generation requests. Each generates one use case.',
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Optional name for the use case - if provided, will be used as the entity name',
                placeholder: 'Automated Lead Scoring'
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
                description: 'Source materials to generate the use case from (at least one required)',
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
        ]
    },
    {
        displayName: 'Linking Strategy Mode',
        name: 'linkingMode',
        type: 'options',
        options: [
            {
                name: 'All Products',
                value: 'ALL',
                description: 'Link to all active offerings (products/services) in the workspace'
            },
            {
                name: 'Specific Products',
                value: 'SPECIFIC',
                description: 'Link to specific products only'
            }
        ],
        default: 'ALL',
        description: 'Strategy for linking generated use cases to products',
    },
    {
        displayName: 'Product Names or IDs',
        name: 'offeringOIds',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        default: [],
        description: 'Products to link to (required when using Specific Products mode). Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
            show: {
                linkingMode: ['SPECIFIC']
            }
        }
    }
];

const displayOptions = {
    show: {
        resource: ['useCase'],
        operation: ['generate'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const body: Record<string, any> = {};

    body.primaryOfferingOId = this.getNodeParameter('primaryOfferingOId', itemIndex) as string || undefined;

    // Process use cases and fix sources structure from fixedCollection
    const useCasesRaw = this.getNodeParameter('useCases', itemIndex) as Array<{
        name?: string;
        sources: { source?: Array<{ type: 'TEXT' | 'URL'; value: string }> };
    }>;

    body.useCases = useCasesRaw.map(useCase => ({
        name: useCase.name,
        sources: useCase.sources?.source || []
    }));

    // Build linking strategy
    const linkingMode = this.getNodeParameter('linkingMode', itemIndex) as string;
    if (linkingMode === 'ALL') {
        body.linkingStrategy = { mode: 'ALL' };
    } else if (linkingMode === 'SPECIFIC') {
        const offeringOIds = this.getNodeParameter('offeringOIds', itemIndex) as string[];
        if (!offeringOIds || offeringOIds.length === 0) {
            throw new NodeOperationError(this.getNode(), 'Products are required when using Specific Products mode.', { itemIndex });
        }
        body.linkingStrategy = {
            mode: 'SPECIFIC',
            offeringOIds: offeringOIds
        };
    }

    Object.keys(body).forEach(key => (body[key] === undefined) && delete body[key]);

    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/use-case/generate', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}