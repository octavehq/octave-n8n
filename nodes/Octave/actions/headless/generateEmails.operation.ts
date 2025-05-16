import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { octaveApiRequest } from '../../transport/OctaveApiRequest';
import { applyDisplayOptions, parseJsonParameter } from '../utils';

const properties: INodeProperties[] = [
    // Sequence Details
    {
        displayName: 'Sequence: Steps',
        name: 'sequenceSteps',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 4,
        description: 'Number of steps in the email sequence',
    },
    {
        displayName: 'Sequence: Length',
        name: 'sequenceLength',
        type: 'options',
        options: [
            { name: 'Short', value: 'SHORT' },
            { name: 'Medium', value: 'MEDIUM' },
            { name: 'Long', value: 'LONG' },
            { name: 'Mixed', value: 'MIXED' },
        ],
        default: 'MIXED',
        description: 'Length of the emails in the sequence',
    },
    {
        displayName: 'Sequence: Type',
        name: 'sequenceType',
        type: 'options',
        options: [
            { name: 'Cold Outbound', value: 'COLD_OUTBOUND' },
            { name: 'Follow Up', value: 'FOLLOW_UP' },
        ],
        default: 'COLD_OUTBOUND',
        description: 'Type of the email sequence',
    },
    {
        displayName: 'Sequence: Primary Goal',
        name: 'sequencePrimaryGoal',
        type: 'options',
        options: [
            { name: 'Initiate Conversation', value: 'INITIATE_CONVERSATION' },
            { name: 'Book Meeting', value: 'BOOK_MEETING' },
        ],
        default: 'INITIATE_CONVERSATION',
        description: 'Primary goal of the email sequence',
    },
    {
        displayName: 'Sequence: Generate Unique Subject Lines',
        name: 'sequenceGenerateUniqueSubjectLines',
        type: 'boolean',
        default: true,
        description: 'Whether to generate unique subject lines for each email in the sequence',
    },
    {
        displayName: 'Sequence: Additional Instructions',
        name: 'sequenceAdditionalInstructions',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Additional instructions for the sequence generation',
    },
    {
        displayName: 'Sequence: Example for Intro Email',
        name: 'sequenceExampleForIntroEmail',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        description: 'Example text for the first email in the sequence',
    },
    {
        displayName: 'Sequence: Example for Final Email',
        name: 'sequenceExampleForFinalEmail',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        description: 'Example text for the final email in the sequence',
    },
    // Offering Details
    {
        displayName: 'Offering: URL',
        name: 'offeringUrl',
        type: 'string',
        default: '',
        placeholder: 'https://www.example.com',
        description: 'URL of the product/service offering',
    },
    {
        displayName: 'Offering: Name',
        name: 'offeringName',
        type: 'string',
        default: '',
        placeholder: 'Example product/service',
        description: 'Name of the product/service offering',
    },
    {
        displayName: 'Offering: Core Value Proposition (JSON or Text)',
        name: 'offeringCoreValueProposition',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Core value proposition of the offering. Can be simple text or a JSON string.',
    },
    {
        displayName: 'Offering: Key Differentiator (JSON or Text)',
        name: 'offeringKeyDifferentiator',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Key differentiator of the offering. Can be simple text or a JSON string.',
    },
    {
        displayName: 'Offering: Customer Outcomes (JSON or Text)',
        name: 'offeringCustomerOutcomes',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Customer outcomes achieved with the offering. Can be simple text or a JSON string.',
    },
    {
        displayName: 'Offering: Additional Info (JSON or Text)',
        name: 'offeringAdditionalOfferingInfo',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Additional information about the offering. Can be simple text or a JSON string.',
    },
    // Recipient Details
    {
        displayName: 'Recipient: First Name',
        name: 'recipientFirstName',
        type: 'string',
        default: '',
        placeholder: 'John',
        description: 'First name of the email recipient',
    },
    {
        displayName: 'Recipient: Job Title',
        name: 'recipientJobTitle',
        type: 'string',
        default: '',
        placeholder: 'Example title',
        description: 'Job title of the email recipient',
    },
    {
        displayName: 'Recipient: LinkedIn Profile URL',
        name: 'recipientLinkedInProfile',
        type: 'string',
        default: '',
        placeholder: 'https://www.linkedin.com/in/example',
        description: 'LinkedIn profile URL of the recipient',
    },
    {
        displayName: 'Recipient: Additional Info',
        name: 'recipientAdditionalRecipientInfo',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Additional information about the recipient',
    },
    {
        displayName: 'Recipient: Company Name',
        name: 'recipientCompanyName',
        type: 'string',
        default: '',
        placeholder: 'Example company name',
        description: 'Company name of the recipient',
    },
    {
        displayName: 'Recipient: Company Domain',
        name: 'recipientCompanyDomain',
        type: 'string',
        default: '',
        placeholder: 'example.com',
        description: 'Company domain of the recipient',
    },
    // Sender Details
    {
        displayName: 'Sender: First Name',
        name: 'senderFirstName',
        type: 'string',
        default: '',
        description: 'First name of the sender',
    },
    {
        displayName: 'Sender: Last Name',
        name: 'senderLastName',
        type: 'string',
        default: '',
        description: 'Last name of the sender',
    },
    {
        displayName: 'Sender: Job Title',
        name: 'senderJobTitle',
        type: 'string',
        default: '',
        description: 'Job title of the sender',
    },
    {
        displayName: 'Sender: Company Name',
        name: 'senderCompanyName',
        type: 'string',
        default: '',
        description: 'Company name of the sender',
    },
    {
        displayName: 'Sender: Company Domain',
        name: 'senderCompanyDomain',
        type: 'string',
        default: '',
        description: 'Company domain of the sender',
    },
    // Email Details
    {
        displayName: 'Email: Language',
        name: 'emailLanguage',
        type: 'string',
        default: 'en',
        description: 'Language for email generation (e.g., en, es)',
    },
    {
        displayName: 'Email: Tone',
        name: 'emailTone',
        type: 'string', // Could be options if defined values exist
        default: 'Professional',
        description: 'Desired tone of the email (e.g., Professional, Casual, Persuasive)',
    },
    {
        displayName: 'Email: Style',
        name: 'emailStyle',
        type: 'string', // Could be options
        default: 'Concise',
        description: 'Writing style of the email (e.g., Concise, Detailed)',
    },
    {
        displayName: 'Email: Output Format',
        name: 'emailOutputFormat',
        type: 'options',
        options: [
            { name: 'Text', value: 'TEXT' },
            { name: 'HTML', value: 'HTML' },
            { name: 'Markdown', value: 'MARKDOWN' },
        ],
        default: 'TEXT',
        description: 'Desired output format for the generated emails',
    },
    {
        displayName: 'Email: Persona',
        name: 'emailPersona',
        type: 'string',
        default: '',
        description: 'Specific persona to adopt for email generation (optional)',
    },
    // Additional Context
    {
        displayName: 'Additional Context (JSON)',
        name: 'additionalContextJson',
        type: 'json',
        default: '{}',
        description: 'A JSON object for any other contextual information or custom fields',
        placeholder: '{\n    "customVariable1": "customValue1",\n    "integrationId": "int_123xyz"\n}',
    },
];

const displayOptions = {
    show: {
        resource: ['headless'],
        operation: ['generateEmails'],
    },
};

export const exportedProperties: INodeProperties[] = applyDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[][] | null> {
    const sequence = {
        steps: this.getNodeParameter('sequenceSteps', itemIndex, 4) as number,
        length: this.getNodeParameter('sequenceLength', itemIndex, 'MIXED') as string,
        type: this.getNodeParameter('sequenceType', itemIndex, 'COLD_OUTBOUND') as string,
        primaryGoal: this.getNodeParameter('sequencePrimaryGoal', itemIndex, 'INITIATE_CONVERSATION') as string,
        generateUniqueSubjectLines: this.getNodeParameter('sequenceGenerateUniqueSubjectLines', itemIndex, true) as boolean,
        additionalInstructions: this.getNodeParameter('sequenceAdditionalInstructions', itemIndex) as string | undefined,
        exampleForIntroEmail: this.getNodeParameter('sequenceExampleForIntroEmail', itemIndex) as string | undefined,
        exampleForFinalEmail: this.getNodeParameter('sequenceExampleForFinalEmail', itemIndex) as string | undefined,
    };

    const offering = {
        url: this.getNodeParameter('offeringUrl', itemIndex) as string | undefined,
        name: this.getNodeParameter('offeringName', itemIndex) as string | undefined,
        coreValueProposition: this.getNodeParameter('offeringCoreValueProposition', itemIndex) as string | undefined,
        keyDifferentiator: this.getNodeParameter('offeringKeyDifferentiator', itemIndex) as string | undefined,
        customerOutcomes: this.getNodeParameter('offeringCustomerOutcomes', itemIndex) as string | undefined,
        additionalOfferingInfo: this.getNodeParameter('offeringAdditionalOfferingInfo', itemIndex) as string | undefined,
    };

    const recipient = {
        firstName: this.getNodeParameter('recipientFirstName', itemIndex) as string | undefined,
        jobTitle: this.getNodeParameter('recipientJobTitle', itemIndex) as string | undefined,
        linkedInProfile: this.getNodeParameter('recipientLinkedInProfile', itemIndex) as string | undefined,
        additionalRecipientInfo: this.getNodeParameter('recipientAdditionalRecipientInfo', itemIndex) as string | undefined,
        companyName: this.getNodeParameter('recipientCompanyName', itemIndex) as string | undefined,
        companyDomain: this.getNodeParameter('recipientCompanyDomain', itemIndex) as string | undefined,
    };

    const sender = {
        firstName: this.getNodeParameter('senderFirstName', itemIndex) as string | undefined,
        lastName: this.getNodeParameter('senderLastName', itemIndex) as string | undefined,
        jobTitle: this.getNodeParameter('senderJobTitle', itemIndex) as string | undefined,
        companyName: this.getNodeParameter('senderCompanyName', itemIndex) as string | undefined,
        companyDomain: this.getNodeParameter('senderCompanyDomain', itemIndex) as string | undefined,
    };

    const emailDetails = {
        lang: this.getNodeParameter('emailLanguage', itemIndex, 'en') as string,
        tone: this.getNodeParameter('emailTone', itemIndex, 'Professional') as string,
        style: this.getNodeParameter('emailStyle', itemIndex, 'Concise') as string,
        outputFormat: this.getNodeParameter('emailOutputFormat', itemIndex, 'TEXT') as string,
        persona: this.getNodeParameter('emailPersona', itemIndex) as string | undefined,
    };

    const additionalContext = parseJsonParameter.call(this, 'additionalContextJson', itemIndex, '{}');

    const body: Record<string, any> = {
        sequence,
        offering,
        recipient,
        sender,
        email: emailDetails, // API might expect 'email' for emailDetails
        additionalContext,
    };

    // Clean undefined optional fields from nested objects
    Object.keys(sequence).forEach(key => (sequence as any)[key] === undefined && delete (sequence as any)[key]);
    Object.keys(offering).forEach(key => (offering as any)[key] === undefined && delete (offering as any)[key]);
    Object.keys(recipient).forEach(key => (recipient as any)[key] === undefined && delete (recipient as any)[key]);
    Object.keys(sender).forEach(key => (sender as any)[key] === undefined && delete (sender as any)[key]);
    Object.keys(emailDetails).forEach(key => (emailDetails as any)[key] === undefined && delete (emailDetails as any)[key]);
    if (Object.keys(additionalContext).length === 0) {
        delete body.additionalContext;
    }


    const responseData = await octaveApiRequest.call(this, 'POST', '/api/v2/headless/generate-emails', body);

    const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([responseData]), // Assuming API returns the generated emails or a success indicator
        { itemData: { item: itemIndex } },
    );
    return [executionData];
}