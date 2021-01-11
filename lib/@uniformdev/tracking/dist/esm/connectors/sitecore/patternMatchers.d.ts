import { ProfileDefinition } from './profiles';
import { ProfileKeyScores } from './scoring';
export interface GetDistance {
    (a: number[], b: number[]): number;
}
export interface PatternMatcher {
    match(scores: ProfileKeyScores, profile: ProfileDefinition): PatternMatch | undefined;
}
export interface PatternMatch {
    name?: string;
    patternId: string;
    distance: number;
}
export declare function getPatternMatcher(getDistance?: GetDistance): PatternMatcher;
//# sourceMappingURL=patternMatchers.d.ts.map