export function tryParseJson(jsonString) {
    try {
        var json = JSON.parse(jsonString);
        // handle non-exception-throwing cases
        if (json && typeof json === 'object' && json !== null) {
            return json;
        }
    }
    catch (e) {
        console.error("Error parsing JSON string '" + jsonString + "'", e);
    }
    return null;
}
//# sourceMappingURL=tryParse.js.map