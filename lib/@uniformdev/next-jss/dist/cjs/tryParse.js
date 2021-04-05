"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseJsonOrYaml = void 0;
var jsYaml = require('js-yaml');
function tryParseJsonOrYaml(jsonString) {
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
exports.tryParseJsonOrYaml = tryParseJsonOrYaml;
//# sourceMappingURL=tryParse.js.map