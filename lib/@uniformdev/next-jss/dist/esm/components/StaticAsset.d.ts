import { ReactNode } from 'react';
interface StaticAssetProps {
    path: string;
    children: (result: {
        path: string;
    }) => ReactNode;
}
export default function StaticAsset({ path, children }: StaticAssetProps): ReactNode;
export {};
//# sourceMappingURL=StaticAsset.d.ts.map