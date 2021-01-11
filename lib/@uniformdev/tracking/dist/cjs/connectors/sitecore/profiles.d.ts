export interface BaseProfile {
    name: string;
    keys: ProfileKeyDefinitions;
}
/**
 * Profiles that are set on a visit or visitor.
 */
export interface ProfilesStored {
    [profileId: string]: ProfileStored;
}
/**
 * Profile key values set on a visit or visitor.
 */
export interface ProfileKeyValuesStored {
    keys: ProfileKeyValues;
    updateCount: number;
}
/**
 * Profile that is set on a visit or visitor.
 */
export interface ProfileStored extends BaseProfile {
    /**
     * Number of times the profile values have been updated.
     */
    updateCount: number;
}
/**
 * Profile definitions that are used to determine how a profile is scored.
 */
export interface ProfileDefinitions {
    [profileId: string]: ProfileDefinition;
}
/**
 * Profile definition that is used to determine how a profile is scored.
 */
export interface ProfileDefinition extends BaseProfile {
    type: string;
    decay: number;
    patterns?: PatternDefinitions;
}
export interface ProfileKeyDefinitions {
    [profileKeyId: string]: ProfileKeyDefinition;
}
export interface ProfileKeyDefinition {
    name: string;
    value: number;
}
export interface ProfileKeyValues {
    [profileKeyId: string]: number;
}
export interface PatternDefinitions {
    [patternId: string]: PatternDefinition;
}
export interface PatternDefinition {
    name: string;
    keys: ProfileKeyValues;
}
export interface ProfilePatterns {
    [profileId: string]: string;
}
export interface PatternMatches {
    [profileId: string]: PatternMatch;
}
export interface PatternMatch {
    patternId: string;
    name: string;
    distance?: number;
}
//# sourceMappingURL=profiles.d.ts.map