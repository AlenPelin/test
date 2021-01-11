import { LocalStorageProvider } from './localStorage';
export default function getStorageProvider(storage, getCustomProvider, logger) {
    switch (storage) {
        case 'custom':
            var provider = getCustomProvider ? getCustomProvider() : undefined;
            if (!provider) {
                logger.error('When the custom storage provider type is specified, getCustomProvider must return a provider.', { storage: storage });
            }
            return provider;
        case 'default':
        case 'local':
            break;
        default:
            logger.error('The storage option specified for the tracker is not supported. Default storage provider will be used.', { storage: storage });
    }
    return new LocalStorageProvider();
}
//# sourceMappingURL=getStorageProvider.js.map