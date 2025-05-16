
import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OctaveApi implements ICredentialType {
    name = 'octaveApi';
    displayName = 'Octave API';
    documentationUrl = 'https://docs.octavehq.com/'; // Replace if different
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your Octave API Key (found in your Octave dashboard)',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://app.octavehq.com',
            description: 'The base URL for the Octave API (e.g., https://app.octavehq.com)',
        },
    ];
}
