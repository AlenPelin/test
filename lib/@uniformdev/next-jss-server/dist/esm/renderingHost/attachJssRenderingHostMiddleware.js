import * as bodyParser from 'body-parser';
import { getJssRenderingHostMiddleware } from './getRenderingHostMiddleware';
export function attachJssRenderingHostMiddleware(server, nextApp) {
    // Setup body parsing middleware for incoming POST requests.
    var jsonBodyParser = bodyParser.json({ limit: '2mb' });
    // Setup the JSS rendering host route.
    // The URL that is called is configured via JSS app config, e.g. `<app serverSideRenderingEngineEndpointUrl="" />`
    server.post('/jss-render', jsonBodyParser, getJssRenderingHostMiddleware(nextApp));
}
//# sourceMappingURL=attachJssRenderingHostMiddleware.js.map