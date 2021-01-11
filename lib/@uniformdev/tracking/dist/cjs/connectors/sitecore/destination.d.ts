import { Destination } from '../../dispatchers/destination';
import { XdbDispatcherSettings } from './dispatcher';
export declare class XdbDestination implements Destination, XdbDispatcherSettings {
    constructor(init?: Partial<XdbDestination>);
    httpHeaders?: {
        [key: string]: any;
    };
    queryStringParameters?: string;
    type: string;
}
//# sourceMappingURL=destination.d.ts.map