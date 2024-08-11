export function processObject(data: any, excludeFields: string[] = []): any {
    if (!data) return null;

    // If the data is an array, process each item in the array
    if (Array.isArray(data)) {
        return data.map(item => processObject(item, excludeFields));
    }

    // If the data is an object, process each key-value pair
    if (typeof data === 'object' && data !== null) {
        const processedData: any = {};

        for (const key in data) {
            if (data.hasOwnProperty(key) && !excludeFields.includes(key)) {
                if (typeof data[key] === 'bigint') {
                    processedData[key] = data[key].toString();
                } else if (data[key] instanceof Date) {
                    // Convert Date objects to ISO string
                    processedData[key] = data[key].toISOString();
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    // Recursively process nested objects
                    processedData[key] = processObject(data[key], excludeFields);
                } else {
                    processedData[key] = data[key];
                }
            }
        }

        return processedData;
    }

    // If the data is neither an array nor an object, return it as is
    return data;
}
