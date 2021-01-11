import { Destination, Dispatcher } from "../dispatchers";
import { GetDispatchersArgs } from "./handleDestinations";
export interface OracleDmpCallback {
    (data: any): void;
}
export declare function getDispatchersForOracleDmpDestinations(destinations: Destination[], args: GetDispatchersArgs): Dispatcher[];
//# sourceMappingURL=oracleDmp.d.ts.map