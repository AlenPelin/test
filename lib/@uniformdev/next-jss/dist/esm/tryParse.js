var jsYaml = require('js-yaml');
export function tryParseJsonOrYaml(jsonString) {
    try {
        var json = jsYaml.safeLoad(jsonString);
        // handle non-exception-throwing cases
        if (json && typeof json === 'object' && json !== null) {
            return json;
        }
    }
    catch (e) {
        console.error(e);
    }
    return false;
}
//# sourceMappingURL=tryParse.js.map