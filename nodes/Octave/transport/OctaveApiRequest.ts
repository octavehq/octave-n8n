import { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

// Use IHttpRequestMethods directly if it covers all needed methods, or define a subtype
// Assuming IHttpRequestMethods covers GET, POST, PUT, DELETE, PATCH which are common.

export async function octaveApiRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<any> {
    const credentials = await this.getCredentials('octaveApi');
    if (!credentials) {
        throw new NodeOperationError(this.getNode(), 'Octave API credentials are not set!');
    }

    const baseUrl = (credentials.baseUrl as string).replace(/\/$/, ''); // Remove trailing slash

    const options: IHttpRequestOptions = {
        headers: {
            'Accept': 'application/json',
            'api_key': `${credentials.apiKey}`,
            'x-request-source': 'n8n',
        },
        method,
        qs,
        url: `${baseUrl}${endpoint}`,
        json: true,
    };

    if (Object.keys(body).length !== 0) {
        options.body = body;
    }
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        options.headers!['Content-Type'] = 'application/json';
    }

    // console.log(`Making Octave API Request: ${method} ${options.url} QS: ${JSON.stringify(qs)} BODY: ${JSON.stringify(body)} Headers: ${JSON.stringify(options.headers)}`);
    try {
        const responseData = await this.helpers.httpRequest(options);
        // console.log('Octave API Response:', JSON.stringify(responseData, null, 2));
        return responseData;
    } catch (error) {
        // console.error('Octave API Request Error:', JSON.stringify(error, null, 2));
        throw error;
    }
}

export async function octaveApiRequestListAll(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: 'GET', // Explicitly GET for list operations, which is compatible with IHttpRequestMethods
    endpoint: string,
    initialQs: Record<string, any> = {},
): Promise<any[]> {
    const allResults: any[] = [];
    const queryParams = { ...initialQs };
    // API spec default for limit is 10, offset is 0.
    // Using a larger default for "returnAll" efficiency, but API may cap it.
    queryParams.limit = initialQs.limit && initialQs.limit > 0 ? initialQs.limit : 100;
    queryParams.offset = initialQs.offset && initialQs.offset >=0 ? initialQs.offset : 0;

    let responseData;
    let hasNextPageInResponse = true; // Assume true for the first call

    while (hasNextPageInResponse) {
        responseData = await octaveApiRequest.call(this, method, endpoint, {}, queryParams);

        if (responseData && responseData.data && Array.isArray(responseData.data)) {
            allResults.push(...responseData.data);

            // Check for 'hasNext' field in the response structure
            // The API spec sometimes shows "hasNext" and sometimes implies pagination by checking if count < limit
            hasNextPageInResponse = responseData.hasNext === true;

            if (hasNextPageInResponse) {
                (queryParams.offset as number) += responseData.data.length;
                if (responseData.data.length === 0) { // Safety break
                    // console.warn(`Octave API indicated more data (hasNext) but returned an empty array for ${endpoint}. Stopping pagination.`);
                    hasNextPageInResponse = false;
                }
                 if (responseData.data.length < (queryParams.limit as number) ) { // If less items than limit, it's the last page
                    hasNextPageInResponse = false;
                }
            } else {
                 // If hasNext is not explicitly true, or not present, assume no more pages
                 // This also handles cases where the API might not return 'hasNext' but implies it by returning full limit
                 if (responseData.data.length < (queryParams.limit as number) ) {
                    hasNextPageInResponse = false;
                 } else if (responseData.hasNext === undefined && responseData.data.length === (queryParams.limit as number)){
                    // if hasNext is missing, but we received a full page, try to get next page
                    (queryParams.offset as number) += responseData.data.length;
                    hasNextPageInResponse = true; // Try one more page
                 } else {
                    hasNextPageInResponse = false;
                 }
            }
        } else {
            // Fallback for APIs that might return data directly as an array (if any)
            if (Array.isArray(responseData) && responseData.length > 0) {
                allResults.push(...responseData);
            } else if (responseData && Object.keys(responseData).length > 0 && allResults.length === 0) {
                // If it's a single object response for a list-like call
                allResults.push(responseData);
            }
            hasNextPageInResponse = false; // Stop if structure is not as expected for pagination
        }
    }
    return allResults;
}