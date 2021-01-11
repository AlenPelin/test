import { Logger } from '@uniformdev/common';
import { SitecoreContextReaderType } from './contextReaders';
import { DecaySettings } from '../../decay';
import { Tracker, GetTrackerArgs } from '../../trackers';
export declare enum SitecoreCookieNames {
    Campaign = "UNIFORM_TRACKER_SITECORE_campaign",
    Goals = "UNIFORM_TRACKER_SITECORE_goals",
    PatternMatches = "UNIFORM_TRACKER_SITECORE_pattern_matches",
    ProfileScores = "UNIFORM_TRACKER_SITECORE_profile_scores"
}
/**
 * Settings that are specific for when the
 * tracker is used with Sitecore data.
 */
export interface GetSitecoreTrackerArgs extends GetTrackerArgs {
    type?: SitecoreContextReaderType;
    decay?: DecaySettings;
    doNotIncludeDefaultContextReaders?: boolean;
}
/**
 * This function simplifies the process of creating
 * a tracker for a Sitecore site by adding default
 * settings that are needed when tracking data is
 * provided from Sitecore (whether the data comes
 * from JSS Layout Service or the Uniform Page
 * Service).
 * @param args
 * @param logger
 */
export declare function getSitecoreTracker(args: GetSitecoreTrackerArgs, logger: Logger): Tracker | undefined;
//# sourceMappingURL=tracker.d.ts.map