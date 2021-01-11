export interface ProfileDefinition {
    type: string;
    decay: number;
    keys: ProfileKeysDefinition;
}
export interface ProfileKeysDefinition {
    [profileKeyId: string]: ProfileKeyDefinition;
}
export interface ProfileKeyDefinition {
    name: string;
    value: number;
}
export interface ProfileScores {
    profileId: string;
    keys: ProfileKeyScores;
    updateCount: number;
    scoresChanged: boolean;
}
export interface ProfileKeyScores {
    [profileKeyId: string]: number;
}
export interface Scorer {
    (currentScores: ProfileKeyScores, profileId: string, profile: ProfileDefinition, updateCount: number): ProfileScores;
}
export declare function getScorer(type: string): Scorer | undefined;
export declare function getScorerSum(): Scorer;
export declare function getScorerAverage(): Scorer;
export declare function getScorerPercentage(): Scorer;
export declare function getNormalizedScores(scores: ProfileKeyScores, profileKeys: ProfileKeysDefinition): ProfileKeyScores;
//# sourceMappingURL=scoring.d.ts.map