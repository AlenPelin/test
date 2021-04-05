var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { parse } from 'url';
import { renderToHTML } from './renderToHTML';
import { resolveJssDataFromWebhookRequest } from './resolveJSSData';
import { SYMBOL_PREVIEW_DATA } from 'next/dist/next-server/server/api-utils';
export function getJssRenderingHostMiddleware(app, _a) {
    var routeResolver = (_a === void 0 ? {} : _a).routeResolver;
    return function middleware(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var jssData, parsedUrl, routeInfo, html, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req.setTimeout(36000, function () {
                            console.error('request timed out');
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        jssData = resolveJssDataFromWebhookRequest(req);
                        // Server rendering functions expect `GET` requests, but we're handling a `POST` request.
                        // so change the incoming request method.
                        req.method = 'GET';
                        // next.js renderToHtml reads from the req.url property, so set it accordingly
                        req.url = jssData.renderPath;
                        console.log('Rendering host handling request', req.url);
                        // Allows the app to easily determine whether or not it is being rendered via JSS rendering host.
                        req.isJssRenderingHostRequest = true;
                        // Attach the parsed JSS data as an arbitrary property on the `req` object
                        req[SYMBOL_PREVIEW_DATA] = jssData;
                        parsedUrl = parse(jssData.renderPath, true);
                        routeInfo = {
                            pathname: parsedUrl.pathname || '/',
                            params: parsedUrl.query,
                        };
                        // If we have a custom route resolver, then call it with the incoming path and query/param data.
                        // The custom route resolver can then handle mapping route path to actual path.
                        // This is mostly useful for "dynamic" routes, where a single page (e.g. pages/index.js) is intended
                        // to serve routes that aren't statically known by the app. For instance, Sitecore routes that are dynamic.
                        // NOTE: `routeResolver` will likely change the value of `routeInfo.pathname` and _should_ merge `routeInfo.params`
                        // with any params identified by the route matcher/regex.
                        if (routeResolver && typeof routeResolver === 'function') {
                            routeInfo = routeResolver(routeInfo);
                        }
                        return [4 /*yield*/, renderToHTML(app, req, routeInfo.pathname, routeInfo.params)];
                    case 2:
                        html = _a.sent();
                        // TODO: need to handle 404 and/or redirect
                        res.send({
                            html: html,
                            status: 200,
                            redirect: '',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        res.send({
                            html: "<html><body>JSS app rendering error: " + err_1 + "</body></html>",
                            status: 500,
                            redirect: '',
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
}
//# sourceMappingURL=getRenderingHostMiddleware.js.map