# n8n-nodes-octavehq

This is an n8n community node. It lets you use Octave in your n8n workflows.

Octave is the AI-powered messaging brain for B2B go-to-market teams, helping you articulate your product's value, synthesize customer interaction data, and deploy consistent, effective messaging across all your execution channels. In a world of rapid product innovation, Octave ensures your go-to-market strategy is always on message and impactful.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Octave node supports the following operations, categorized by resource:

**Resource: Agent**
*   **List Agents**: List all agents
    *   Corresponds to `GET /api/v2/agents/list`
*   **Build Workspace**: Generate and build a Workspace
    *   Corresponds to `POST /api/v2/agents/workspace/build`
*   **Call Prep**: Generate call prep content including discovery questions, call scripts, and objection handling
    *   Corresponds to `POST /api/v2/agents/call-prep/run`
*   **Enrich Company**: Enrich a company
    *   Corresponds to `POST /api/v2/agents/enrich-company/run`
*   **Enrich Person**: Enrich a Person
    *   Corresponds to `POST /api/v2/agents/enrich-person/run`
*   **Generate Content**: Generate content for a person
    *   Corresponds to `POST /api/v2/agents/generate-content/run`
*   **Run Sequence**: Generate Emails for a person
    *   Corresponds to `POST /api/v2/agents/sequence/run`
*   **Run Prospector**: Find relevant people at a company or lookalike companies
    *   Corresponds to `POST /api/v2/agents/prospector/run`
*   **Qualify Company**: Determine if a company is qualified for a given Product and/or Segment
    *   Corresponds to `POST /api/v2/agents/qualify-company/run`
*   **Qualify Person**: Determine if a person is qualified for a given Product, Persona, and/or Segment
    *   Corresponds to `POST /api/v2/agents/qualify-person/run`

**Resource: Async**
*   **Run Agent Asynchronously**: Triggers an agent to run in the background.
    *   Corresponds to `POST /api/v2/async/agent/run`
*   **Generate Headless Emails Asynchronously**: Triggers headless email generation in the background.
    *   Corresponds to `POST /api/v2/async/headless/generate-emails`

**Resource: Competitor**
*   **List Competitors**: Retrieves a list of competitors with optional filtering.
    *   Corresponds to `GET /api/v2/competitor/list`
*   **Get Competitor**: Retrieves a specific competitor by its OId.
    *   Corresponds to `GET /api/v2/competitor/get`

**Resource: Experiment**
*   **Create Experiment**: Creates a new agent experiment for A/B testing different agents.
    *   Corresponds to `POST /api/v2/agents/experiment/create`

**Resource: Headless**
*   **Generate Emails**: Triggers email generation via the headless service.
    *   Corresponds to `POST /api/v2/headless/generate-emails`

**Resource: Persona**
*   **List Personas**: Retrieves a list of personas.
    *   Corresponds to `GET /api/v2/persona/list`
*   **Get Persona**: Retrieves a specific persona by its OId.
    *   Corresponds to `GET /api/v2/persona/get`

**Resource: Playbook**
*   **List Playbooks**: Retrieves a list of playbooks.
    *   Corresponds to `GET /api/v2/playbook/list`
*   **Get Playbook**: Retrieves a specific playbook by its OId.
    *   Corresponds to `GET /api/v2/playbook/get`
*   **Create Playbook**: Creates a new playbook.
    *   Corresponds to `POST /api/v2/playbook/create`

**Resource: Product**
*   **List Products**: Retrieves a list of products.
    *   Corresponds to `GET /api/v2/product/list`
*   **Get Product**: Retrieves a specific product by its OId.
    *   Corresponds to `GET /api/v2/product/get`

**Resource: Reference**
*   **List References**: Retrieves a list of references.
    *   Corresponds to `GET /api/v2/reference/list`
*   **Get Reference**: Retrieves a specific reference by its OId.
    *   Corresponds to `GET /api/v2/reference/get`
*   **Create Reference**: Creates a new reference.
    *   Corresponds to `POST /api/v2/reference/create`

**Resource: Segment**
*   **List Segments**: Retrieves a list of segments with optional filtering.
    *   Corresponds to `GET /api/v2/segment/list`
*   **Get Segment**: Retrieves a specific segment by its OId.
    *   Corresponds to `GET /api/v2/segment/get`

**Resource: Use Case**
*   **List Use Cases**: Retrieves a list of use cases.
    *   Corresponds to `GET /api/v2/use-case/list`
*   **Get Use Case**: Retrieves a specific use case by its OId.
    *   Corresponds to `GET /api/v2/use-case/get`

## Credentials

Get your API key from the Octave settings page. We recommend naming the credentials with the Workspace that the API key is associated with.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Library Overview](https://youtu.be/UyU1tDuRE58)
* [Playbooks Overview](https://youtu.be/SINDvLIfRa8)
* [Agents Overview](https://www.youtube.com/watch?v=oExCRibGjAU)
* [Octave + Clay Overview](https://www.youtube.com/watch?v=JjYLBddEn7A)


## Version history
0.1.1 - Octave <> N8N. Let the games begin!
1.0.1 - Add `x-request-source` header to indicate request came from n8n
1.0.2 - Add Credentials test + make Octave node usable by AI
1.1.0 - Added Competitor, Segment, and Experiment resources; Added Call Prep agent; Removed Personalize Template agent; Improved modular architecture
1.1.1 - Uses IHttpRequestOptions instead of deprecated IRequestOptions
1.1.2 - Uses httpRequestWithAuthentication instead of httpRequest to be more secure and maintainable
1.2.0 - Removed List API Keys endpoint
1.2.1 - Rebuild to remove deprecated API files from build