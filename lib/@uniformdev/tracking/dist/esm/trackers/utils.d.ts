import { Visit } from '../models/visit';
import { Visitor } from '../models/visitor';
import { TrackedActivityResults } from '../models/trackedActivity';
export declare function getVisitChanges(activity: TrackedActivityResults, visit: Visit, _visitor: Visitor): Map<string, string[]>;
export declare function getVisitorChanges(activity: TrackedActivityResults, _visit: Visit, _visitor: Visitor): string[];
//# sourceMappingURL=utils.d.ts.map