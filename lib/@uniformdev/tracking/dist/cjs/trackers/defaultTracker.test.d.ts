/// <reference types="jest" />
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeEmptyResults(): CustomMatcherResult;
        }
    }
}
export {};
//# sourceMappingURL=defaultTracker.test.d.ts.map