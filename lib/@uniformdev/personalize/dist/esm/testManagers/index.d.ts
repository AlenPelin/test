import { Logger } from '@uniformdev/common';
/**
 * Settings for a specific test.
 */
export interface TestSettings {
    id: string;
    name: string;
    start?: string;
    end?: string;
    size: number;
}
/**
 * Provides access to the visitor's state with respect
 * to the current test. For example, one implementation
 * might store the state in a cookie while another may
 * store state in an external state server.
 */
export interface TestStateManager {
    getIsTestingStateKnown: (settings: TestSettings) => boolean;
    getIsIncludedInTest: (settings: TestSettings) => boolean;
    setIsIncludedInTest: (value: boolean, settings: TestSettings) => void;
    setTestNotRunning: () => void;
}
/**
 * Settings that control how the test manager operates.
 */
export interface TestManagerOptions {
    disabled?: boolean;
    logger?: Logger;
}
/**
 * Provides the ability to determine whether or not
 * a visitor is included in a test.
 */
export interface TestManager {
    disabled: boolean;
    getIsIncludedInTest: () => boolean;
}
/**
 * Settings used to get a test manager.
 */
export interface GetTestManagerArgs {
    testSettings: TestSettings[];
    testStateManager: TestStateManager;
    options?: TestManagerOptions;
}
/**
 * Gets a test manager.
 * @param args
 */
export declare function getTestManager(args: GetTestManagerArgs): TestManager;
//# sourceMappingURL=index.d.ts.map