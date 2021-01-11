"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unescapeEsiHtml = exports.defaultCharacterMap = void 0;
exports.defaultCharacterMap = { '&#x27;': "'", '&amp;': "&", '&gt;': ">", '&lt;': "<" };
function unescapeEsiHtml(html, characterMap) {
    if (characterMap === void 0) { characterMap = exports.defaultCharacterMap; }
    var esiWhenRegex = new RegExp('<esi:(when|foreach|assign) [^>]+>', 'gim');
    var rawRegex = Object.keys(characterMap).join('|');
    var escapedCharactersRegex = new RegExp(rawRegex, 'gim');
    //const escapedCharactersRegex = new RegExp('/<esi:when [^>]+>/', 'gim');
    // React (and other libs) will escape various characters in element attributes, e.g. single-quote becomes `&#x27`.
    // This escaping will cause ESI parsing/evaluation to fail (at least for Akamai).
    // So we unescape characters we know about.
    // NOTE: this is a very greedy replacement process, so characters outside of ESI tags will
    // be affected as well.
    // const esiValidHtml = html.replace(/&#x27;/gim, "'");
    //const esiValidHtml = html.replace(escapedCharactersRegex, (char: string) => characterMap[char]);
    // function upperToHyphenLower(substring:string) {
    //   return "blabla"+ substring + "asdasd";
    // }
    var esiValidHtml = html.replace(esiWhenRegex, function (match) { return match.replace(escapedCharactersRegex, function (char) { return characterMap[char]; }); });
    return esiValidHtml;
}
exports.unescapeEsiHtml = unescapeEsiHtml;
//# sourceMappingURL=unescapeEsiHtml.js.map