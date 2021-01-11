import { Visit } from '../../models';
export interface FilteredActivities {
    [activityId: string]: Date[];
}
export declare function getVisitActivities(type: string, visit: Visit): FilteredActivities;
//# sourceMappingURL=activities.d.ts.map