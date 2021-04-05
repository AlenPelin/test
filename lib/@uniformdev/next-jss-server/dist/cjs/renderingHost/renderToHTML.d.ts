/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export interface CompatibleNextServer {
    render(req: IncomingMessage, res: ServerResponse, pathname: string, params: any): Promise<string>;
}
export declare function renderToHTML(app: CompatibleNextServer, req: IncomingMessage, pathname: string, params: any): Promise<unknown>;
//# sourceMappingURL=renderToHTML.d.ts.map