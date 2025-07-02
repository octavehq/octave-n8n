import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

/**
 * Safely parses a JSON string parameter.
 * @param this The execution context (IExecuteFunctions).
 * @param paramName The name of the parameter to get.
 * @param itemIndex The index of the current item.
 * @param defaultValue The default value if the parameter is not found (should be a JSON string).
 * @returns The parsed JSON object.
 * @throws NodeOperationError if JSON parsing fails.
 */
export function parseJsonParameter(this: IExecuteFunctions, paramName: string, itemIndex: number, defaultValue: string = '{}'): any {
    const jsonString = this.getNodeParameter(paramName, itemIndex, defaultValue) as string;
    try {
        // Ensure that empty string is treated as empty object if that's the default intention
        if (jsonString.trim() === '' && defaultValue === '{}') {
            return {};
        }
        return JSON.parse(jsonString);
    } catch (e: any) {
        throw new NodeOperationError(this.getNode(), `Invalid JSON in parameter '${paramName}': ${e.message}`, { itemIndex });
    }
}

/**
 * Merges common displayOptions into an array of node properties.
 * Each property will have the commonDisplayOptions applied under its own displayOptions.
 * If a property already has displayOptions, they will be merged; otherwise, they will be set.
 *
 * @param commonDisplayOptions The displayOptions to apply to all properties.
 * @param properties The array of INodeProperties to update.
 * @returns A new array of INodeProperties with updated displayOptions.
 */
export function applyDisplayOptions(commonDisplayOptions: object, properties: INodeProperties[]): INodeProperties[] {
	return properties.map(prop => ({
		...prop,
		displayOptions: {
			...(prop.displayOptions || {}),
			...commonDisplayOptions,
		},
	}));
}


/**
 * Sanitizes the 'apiKey' field in an array of API key objects for UI display.
 * @param apiKeys An array of API key objects.
 * @returns A new array with the 'key' field redacted.
 */
export function sanitizeApiKeys(apiKeys: any[]): any[] {
	if (!apiKeys || !Array.isArray(apiKeys)) {
		return [];
	}
	return apiKeys.map(keyObj => {
		const key = keyObj.apiKey as string;
		const sanitizedKey = key && key.length > 4 ? `****-${key.slice(-4)}` : '****';
		return {
			...keyObj,
			key: sanitizedKey,
		};
	});
}