import { Logger } from '@uniformdev/common';
import { Dispatcher } from '../dispatchers/dispatcher';
import { GaDestination } from '../connectors/ga/destination';
import { OracleDmpDestination } from '../connectors/oracleDmp/destination';
export interface DestinationMapArgs {
    logger: Logger;
    loggerPrefix: string;
}
export interface GetDispatchersArgs {
    logger: Logger;
    loggerPrefix: string;
    ga?: {
        initializeGa: {
            (destination: GaDestination, logger: Logger): boolean;
        };
    };
    oracleDmp?: {
        initializeOracleDmp?: {
            (destination: OracleDmpDestination, logger: Logger): boolean;
        };
    };
    getCookie: {
        (name: string): any;
    };
    removeCookie: {
        (name: string): void;
    };
    setCookie: {
        (name: string, value: any): void;
    };
}
/**
 * When dispatchers are configured in Sitecore, they
 * are exposed in tracking data as destinations. This
 * function controls the process responsible for
 * converting these destinations into dispatchers.
 * @param trackingConfig
 * @param args
 */
export declare function getDispatchersFromTrackingConfig(trackingConfig: any, args: GetDispatchersArgs): Dispatcher[];
//# sourceMappingURL=handleDestinations.d.ts.map