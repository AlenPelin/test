import React, { ReactNode } from 'react';
export declare const StaticAssetContext: React.Context<{
    assetPrefix: string;
}>;
interface StaticAssetContextProviderProps {
    assetPrefix: string;
    children: ReactNode;
}
export declare const StaticAssetContextProvider: ({ assetPrefix, children, }: StaticAssetContextProviderProps) => JSX.Element;
export {};
//# sourceMappingURL=StaticAssetContext.d.ts.map