"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var unescapeEsiHtml_1 = require("./unescapeEsiHtml");
it('should unescape default esi characters of esi:when open tags only', function () {
    var escapedHtmlData = '<esi:when test="$(GEO{&#x27;country_code&#x27;}) == &#x27;SG&#x27; &amp;&amp; ($(QUERY_STRING{&#x27;utm_source&#x27;}) == &#x27;ppc&#x27;)">&amp;&gt;&lt;</esi:when>';
    var unescapedHtmlData = "<esi:when test=\"$(GEO{'country_code'}) == 'SG' && ($(QUERY_STRING{'utm_source'}) == 'ppc')\">&amp;&gt;&lt;</esi:when>";
    var actual = unescapeEsiHtml_1.unescapeEsiHtml(escapedHtmlData);
    expect(unescapedHtmlData).toBe(actual);
});
it('should unescape user-defined characters', function () {
    var escapedHtmlData = '<esi:when test="$(GEO{&#x27;country_code&#x27;}) == &#x27;SG&#x27;"><esi:when test="$(GEO{&#x0E;yep&#x0E;})>';
    var unescapedHtmlData = "<esi:when test=\"$(GEO{'country_code'}) == 'SG'\"><esi:when test=\"$(GEO{♫yep♫})>";
    var characterMap = __assign(__assign({}, unescapeEsiHtml_1.defaultCharacterMap), { '&#x0E;': '♫' });
    var actual = unescapeEsiHtml_1.unescapeEsiHtml(escapedHtmlData, characterMap);
    expect(unescapedHtmlData).toBe(actual);
});
//# sourceMappingURL=unescapeEsiHtml.test.js.map