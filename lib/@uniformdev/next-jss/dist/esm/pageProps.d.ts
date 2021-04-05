export interface JssConfig {
    sitecore: {
        apiKey: string;
        layoutServiceHost: string;
    };
    defaultLanguage: string;
}
export interface DefaultProps {
    layoutData: unknown;
    statusCode: number;
    dictionary: any;
    language: string;
    assetPrefix: string;
    jssConfig: JssConfig;
}
export declare function mergeProps(props: any, defaultProps: DefaultProps): any;
//# sourceMappingURL=pageProps.d.ts.map