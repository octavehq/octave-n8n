import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    {
        displayName: 'Agent OId Name or ID',
        name: 'agentOId',
        type: 'options',
        required: true,
        typeOptions: { loadOptionsMethod: 'getAgents' },
        default: '',
        description: 'The OId of the prospector agent to run. Choose from the list, or specify an ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Company Domain',
        name: 'companyDomain',
        type: 'string',
        default: '',
        description: 'Company domain to prospect (e.g., example.com) (optional)',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        // Disable default limit of 50 here since it's defined on the Agent
        default: 0, // eslint-disable-line
        typeOptions: { minValue: 0 }, // eslint-disable-line
        description: 'Max number of results to return',
        hint: 'If not set, the agent will use its default limit',
    },
    {
        displayName: 'Minimal Response',
        name: 'minimal',
        type: 'boolean',
        default: true,
        description: 'Whether to return a minimal version of the contact data',
    },
    {
        displayName: 'Playbook Name or ID',
        name: 'playbookOId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getPlaybooks' },
        default: '',
        description: 'Playbook to use for prospecting (optional). Choose from the list, or specify an ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Persona Names or Names or IDs',
        name: 'personaOIds',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getPersonas',
        },
        default: [],
        description: 'Personas to target for prospecting (optional). Choose from the list, or specify IDs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Fuzzy Titles',
        name: 'fuzzyTitles',
        type: 'string',
        default: '',
        description: 'Job titles for fuzzy matching (e.g., VP Marketing, Head of Sales). Enter multiple titles separated by commas.',
    },
    {
        displayName: 'Exact Titles',
        name: 'exactTitles',
        type: 'string',
        default: '',
        description: 'Job titles for exact matching. Enter multiple titles separated by commas.',
    },
    {
        displayName: 'Exclude Titles',
        name: 'excludeTitles',
        type: 'string',
        default: '',
        description: 'Job titles to exclude from search results. Enter multiple titles separated by commas.',
    },
    {
        displayName: 'Country Filters',
        name: 'countryFilters',
        type: 'string',
        default: '',
        description: 'Countries to include in search results (exact match). Enter multiple countries separated by commas.',
    },
    {
        displayName: 'Country Exclude Filters',
        name: 'countryExcludeFilters',
        type: 'string',
        default: '',
        description: 'Countries to exclude from search results (exact match). Enter multiple countries separated by commas.',
    },
    {
        displayName: 'Location Filters',
        name: 'locationFilters',
        type: 'string',
        default: '',
        description: 'Locations to include in search results (exact match). Enter multiple locations separated by commas.',
    },
    {
        displayName: 'Location Exclude Filters',
        name: 'locationExcludeFilters',
        type: 'string',
        default: '',
        description: 'Locations to exclude from search results (exact match). Enter multiple locations separated by commas.',
    },
    {
        displayName: 'Additional Inputs (JSON)',
        name: 'additionalInputsJson',
        type: 'json',
        default: '{}',
        description: 'A JSON object for any other top-level inputs the agent might accept (optional), will be merged into the main body',
        placeholder: '{\n    "customTopLevelParam": "value"\n}',
    },
];

const displayOptions = {
    show: {
        resource: ['agent'],
        operation: ['runProspector'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const agentOId = this.getNodeParameter('agentOId', itemIndex) as string | undefined;
    if (!agentOId) {
        throw new NodeOperationError(this.getNode(), 'Agent OId is required for this operation.', { itemIndex });
    }

    const searchContext: Record<string, any> = {};

    const playbookOId = this.getNodeParameter('playbookOId', itemIndex) as string | undefined;
    if (playbookOId) searchContext.playbookOId = playbookOId;

    const personaOIds = this.getNodeParameter('personaOIds', itemIndex) as string[] | string | undefined;
    if (personaOIds) {
        searchContext.personaOIds = Array.isArray(personaOIds) ? personaOIds : [personaOIds];
        if (searchContext.personaOIds.length === 0) delete searchContext.personaOIds; // Remove if empty array
    }

    const fuzzyTitlesRaw = this.getNodeParameter('fuzzyTitles', itemIndex, '') as string;
    if (fuzzyTitlesRaw.trim() !== '') {
        const fuzzyTitlesArray = fuzzyTitlesRaw.split(',').map(s => s.trim()).filter(s => s !== '');
        if (fuzzyTitlesArray.length > 0) searchContext.fuzzyTitles = fuzzyTitlesArray;
    }

    const exactTitlesRaw = this.getNodeParameter('exactTitles', itemIndex, '') as string;
    if (exactTitlesRaw.trim() !== '') {
        const exactTitlesArray = exactTitlesRaw.split(',').map(s => s.trim()).filter(s => s !== '');
        if (exactTitlesArray.length > 0) searchContext.exactTitles = exactTitlesArray;
    }

    const excludeTitlesRaw = this.getNodeParameter('excludeTitles', itemIndex, '') as string;
    if (excludeTitlesRaw.trim() !== '') {
        const excludeTitlesArray = excludeTitlesRaw.split(',').map(s => s.trim()).filter(s => s !== '');
        if (excludeTitlesArray.length > 0) searchContext.excludeTitles = excludeTitlesArray;
    }

    // Handle Country Filters
    const countryFiltersRaw = this.getNodeParameter('countryFilters', itemIndex, '') as string;
    const countryExcludeFiltersRaw = this.getNodeParameter('countryExcludeFilters', itemIndex, '') as string;

    if (countryFiltersRaw.trim() !== '' || countryExcludeFiltersRaw.trim() !== '') {
        const personCountry: Record<string, any> = {};

        if (countryFiltersRaw.trim() !== '') {
            const countryFiltersArray = countryFiltersRaw.split(',').map(s => s.trim()).filter(s => s !== '');
            if (countryFiltersArray.length > 0) {
                personCountry.matches = { exact: countryFiltersArray };
            }
        }

        if (countryExcludeFiltersRaw.trim() !== '') {
            const countryExcludeFiltersArray = countryExcludeFiltersRaw.split(',').map(s => s.trim()).filter(s => s !== '');
            if (countryExcludeFiltersArray.length > 0) {
                personCountry.excludes = { exact: countryExcludeFiltersArray };
            }
        }

        if (Object.keys(personCountry).length > 0) {
            searchContext.personCountry = personCountry;
        }
    }

    // Handle Location Filters
    const locationFiltersRaw = this.getNodeParameter('locationFilters', itemIndex, '') as string;
    const locationExcludeFiltersRaw = this.getNodeParameter('locationExcludeFilters', itemIndex, '') as string;

    if (locationFiltersRaw.trim() !== '' || locationExcludeFiltersRaw.trim() !== '') {
        const personLocation: Record<string, any> = {};

        if (locationFiltersRaw.trim() !== '' || locationExcludeFiltersRaw.trim() !== '') {
            const textFilter: Record<string, any> = {};

            if (locationFiltersRaw.trim() !== '') {
                const locationFiltersArray = locationFiltersRaw.split(',').map(s => s.trim()).filter(s => s !== '');
                if (locationFiltersArray.length > 0) {
                    textFilter.matches = { exact: locationFiltersArray };
                }
            }

            if (locationExcludeFiltersRaw.trim() !== '') {
                const locationExcludeFiltersArray = locationExcludeFiltersRaw.split(',').map(s => s.trim()).filter(s => s !== '');
                if (locationExcludeFiltersArray.length > 0) {
                    textFilter.excludes = { exact: locationExcludeFiltersArray };
                }
            }

            if (Object.keys(textFilter).length > 0) {
                personLocation.text = textFilter;
            }
        }

        if (Object.keys(personLocation).length > 0) {
            searchContext.personLocation = personLocation;
        }
    }

    const body: Record<string, any> = { agentOId };

    body.companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string | undefined;
    body.limit = this.getNodeParameter('limit', itemIndex, 10) as number;
    body.minimal = this.getNodeParameter('minimal', itemIndex, true) as boolean;

    // Optional: Include firstName and linkedInProfile if API supports them at top level for prospector
    // const firstName = this.getNodeParameter('firstName', itemIndex) as string | undefined;
    // if (firstName) body.firstName = firstName;
    // const linkedInProfile = this.getNodeParameter('linkedInProfile', itemIndex) as string | undefined;
    // if (linkedInProfile) body.linkedInProfile = linkedInProfile;


    if (Object.keys(searchContext).length > 0) {
        body.searchContext = searchContext;
    }

    const additionalInputs = parseJsonParameter.call(this, 'additionalInputsJson', itemIndex, '{}');
    // Merge additionalInputs into the main body, avoiding overwrites
    for (const key in additionalInputs) {
        if (!body.hasOwnProperty(key)) {
            body[key] = additionalInputs[key];
        }
    }

    // Clean undefined top-level keys
    Object.keys(body).forEach(key => {
        if (body[key] === undefined) {
            delete body[key];
        }
    });

    const responseDataOuter = await octaveApiRequest.call(this, 'POST', '/api/v2/agents/prospector/run', body);

    // Preserve both data and _metadata
    const responseWithMetadata = {
        data: responseDataOuter?.data,
        _metadata: responseDataOuter?._metadata
    };

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseWithMetadata),
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}