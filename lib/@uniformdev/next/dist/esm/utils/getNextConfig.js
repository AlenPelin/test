import getConfig from 'next/config';
import { throwException } from '@uniformdev/common';
export function getNextConfig() {
    return (getConfig() || throwException('config')).publicRuntimeConfig || throwException('throwException');
}
export function getNextServerConfig() {
    return (getConfig() || throwException('config')).serverRuntimeConfig || throwException('throwException');
}
//# sourceMappingURL=getNextConfig.js.map