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
 * Deeply merges two objects.
 * - Arrays are merged and deduplicated.
 * - Plain objects are recursively merged.
 * - Primitives in source override target.
 */
export function deepMerge<T>(target: Partial<T>, source: Partial<T>): T {
	const isObject = (val: unknown): val is Record<string, unknown> =>
		val !== null && typeof val === 'object' && !Array.isArray(val);

	const merged = { ...target } as Record<string, any>;

	for (const key in source) {
		const targetValue = merged[key];
		const sourceValue = source[key];

		if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			// Merge arrays and deduplicate
			merged[key] = Array.from(new Set([...targetValue, ...sourceValue]));
		} else if (isObject(targetValue) && isObject(sourceValue)) {
			// Recursively merge objects
			merged[key] = deepMerge(targetValue, sourceValue);
		} else {
			// Override with source
			merged[key] = sourceValue;
		}
	}

	return merged as T;
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
export function applyDisplayOptions(
	commonDisplayOptions: Partial<INodeProperties['displayOptions']>,
	properties: INodeProperties[],
): INodeProperties[] {
	return properties.map(prop => ({
		...prop,
		displayOptions: deepMerge(prop.displayOptions ?? {}, commonDisplayOptions),
	}));
}