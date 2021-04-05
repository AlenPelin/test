import { tryParseJson } from '@uniformdev/common-server';
export function resolveJssDataFromWebhookRequest(req) {
    if (!req.body) {
        throw new Error('Rendering host request does not contain any data in the body');
    }
    // We assume req.body has already been parsed as JSON via something like `body-parser` middleware.
    var invocationInfo = req.body;
    // By default, the JSS server invokes this route with the following body data structure:
    // {
    //   id: 'JSS app name',
    //   args: ['route path', 'serialized layout data object', 'serialized viewbag object'],
    //   functionName: 'renderView',
    //   moduleName: 'server.bundle'
    // }
    var result = {
        route: null,
        viewBag: null,
        renderPath: '',
    };
    if (!invocationInfo || !invocationInfo.args || !Array.isArray(invocationInfo.args)) {
        return result;
    }
    result.renderPath = invocationInfo.args[0];
    if (invocationInfo.args.length > 0 && invocationInfo.args[1]) {
        result.route = tryParseJson(invocationInfo.args[1]);
    }
    if (invocationInfo.args.length > 1 && invocationInfo.args[2]) {
        result.viewBag = tryParseJson(invocationInfo.args[2]);
    }
    return result;
}
//# sourceMappingURL=resolveJSSData.js.map