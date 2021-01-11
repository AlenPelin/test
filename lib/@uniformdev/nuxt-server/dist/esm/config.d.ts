import { Logger } from '@uniformdev/common';
export declare function config(logger: Logger): {
    dev: boolean;
    env: import("@uniformdev/common").UniformConfig;
    generate: {
        dir: () => string;
        routes: () => Promise<any>;
    };
};
