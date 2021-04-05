import { renderContainerToJSON } from './_processHtmlTestUtils';
jest.mock('next/config', function () { return function () { return ({
    publicRuntimeConfig: {},
    serverRuntimeConfig: {},
}); }; });
describe('processHtml - HTML strings', function () {
    it.each([
        [require('./snippets/anchor-mailto')],
        [require('./snippets/anchor-svg')],
        [require('./snippets/head')],
        [require('./snippets/input.lowercase-urls-trailing-slash')],
        [require('./snippets/input-anchor-internal')],
        [require('./snippets/input-canonical')],
        [require('./snippets/input-external-url')],
        [require('./snippets/input-mailto-link')],
        [require('./snippets/input-og-url')],
        [require('./snippets/input-script-tag-attributes')],
        [require('./snippets/internal-link-query-string')],
        [require('./snippets/script-with-defer')],
    ])('%s', function (_a) {
        var inputHtml = _a.inputHtml;
        expect(renderContainerToJSON(inputHtml)).toMatchSnapshot();
    });
});
//# sourceMappingURL=snippets.spec.js.map