/**
 * Cleanup any html to be ready for the html-to-react
 * parser
 */
export var cleanHtml = function (html) {
    // TODO: xml tag before <svg /> breaks pasing.
    // more replacements may be needed and refactored into a replacement function
    var cleanedupHtml = html.replace('<?xml version="1.0" encoding="utf-8"?><svg', '<svg');
    return cleanedupHtml;
};
//# sourceMappingURL=cleanHtml.js.map