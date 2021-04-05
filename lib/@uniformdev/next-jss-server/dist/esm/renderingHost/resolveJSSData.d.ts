import { SitecoreWebhookRequestData } from '@uniformdev/next-jss';
export interface CompatibleRequest {
    body?: {
        args?: string[];
    };
}
export declare function resolveJssDataFromWebhookRequest(req: CompatibleRequest): SitecoreWebhookRequestData;
//# sourceMappingURL=resolveJSSData.d.ts.map