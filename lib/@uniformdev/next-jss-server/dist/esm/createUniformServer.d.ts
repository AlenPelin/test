import { CreatePublishProviderFunc } from '@uniformdev/common-server';
declare type JSSMode = 'connected' | 'disconnected';
interface CreateServerOptions {
    dev?: boolean;
    jssMode?: JSSMode;
    port?: number;
    serverUrl: string;
    createPublishProvider: CreatePublishProviderFunc;
}
export declare function createUniformServer({ dev, jssMode, port, serverUrl, createPublishProvider, }: CreateServerOptions): Promise<void>;
export {};
//# sourceMappingURL=createUniformServer.d.ts.map