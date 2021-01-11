export interface PublishProvider {
    behavior: 'replace-on-deploy' | 'update-on-deploy';
    deploy(path: string): Promise<void>;
}
//# sourceMappingURL=PublishProvider.d.ts.map