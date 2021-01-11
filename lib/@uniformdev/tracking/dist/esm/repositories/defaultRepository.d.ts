import { TrackingDataRepository } from './repository';
import { StorageProvider } from '../storage';
import { TrackingEvent } from "../trackers/tracker";
import { Logger, SubscriptionManager } from '@uniformdev/common';
export interface GetTrackingDataRepositorySettings {
    logger?: Logger;
    subscriptions?: SubscriptionManager<TrackingEvent>;
}
export declare function getTrackingDataRepository(storage: StorageProvider, settings?: GetTrackingDataRepositorySettings): TrackingDataRepository | undefined;
//# sourceMappingURL=defaultRepository.d.ts.map