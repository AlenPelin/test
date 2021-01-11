import { Visitor } from '../../models/visitor';
import { Visit } from '../../models/visit';
export declare type VisitorPropertyType = 'patterns' | 'profiles' | 'testing' | 'visitCount';
export declare type VisitPropertyType = 'campaign' | 'goals';
export declare type TrackerCookieType = VisitorPropertyType | VisitPropertyType;
/**
 * Gets the values for a property from the visitor
 * in a format that can be set as a cookie value.
 * @param visitor
 */
export declare function getCookieValueFromVisitor(type: VisitorPropertyType, visitor: Visitor): string | undefined;
/**
 * Gets the values for a property from the visit
 * in a format that can be set as a cookie value.
 * @param visit
 */
export declare function getCookieValueFromVisit(type: VisitPropertyType, visit: Visit): string | undefined;
//# sourceMappingURL=cookies.d.ts.map