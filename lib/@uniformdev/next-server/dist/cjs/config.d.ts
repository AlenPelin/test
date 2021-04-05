import { NextConfig } from 'next/dist/next-server/server/config';
import { ConfigOptions } from '.';
export declare function config({ logger, ...nextConfig }?: NextConfig & ConfigOptions): {
    [key: string]: any;
    i18n?: {
        locales: string[];
        defaultLocale: string;
        domains?: import("next/dist/next-server/server/config").DomainLocales | undefined;
        localeDetection?: false | undefined;
    } | null | undefined;
    headers?: (() => Promise<import("next/dist/lib/load-custom-routes").Header[]>) | undefined;
    rewrites?: (() => Promise<import("next/dist/lib/load-custom-routes").Rewrite[]>) | undefined;
    redirects?: (() => Promise<import("next/dist/lib/load-custom-routes").Redirect[]>) | undefined;
    trailingSlash?: boolean | undefined;
} & {
    publicRuntimeConfig: any;
} & {
    trailingSlash: boolean;
};
//# sourceMappingURL=config.d.ts.map