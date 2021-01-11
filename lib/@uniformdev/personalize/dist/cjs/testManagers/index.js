"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestManager = void 0;
const common_1 = require("@uniformdev/common");
/**
 * Gets a test manager.
 * @param args
 */
function getTestManager(args) {
    const { testSettings, testStateManager, options } = args;
    if (options === null || options === void 0 ? void 0 : options.disabled) {
        return {
            disabled: true,
            getIsIncludedInTest: () => false,
        };
    }
    const logger = (options === null || options === void 0 ? void 0 : options.logger) || common_1.getNullLogger();
    function getIsIncludedInTest() {
        //
        //
        const currentTest = getCurrentTestSettings();
        if (!currentTest) {
            testStateManager.setTestNotRunning(); //delete cookie
            return false;
        }
        //
        //
        let isIncludedInTest = false;
        if (testStateManager.getIsTestingStateKnown(currentTest)) {
            isIncludedInTest = testStateManager.getIsIncludedInTest(currentTest);
        }
        else {
            isIncludedInTest = getNextIncludeInTest(currentTest);
            testStateManager.setIsIncludedInTest(isIncludedInTest, currentTest);
        }
        return isIncludedInTest;
    }
    function getCurrentTestSettings() {
        if (Array.isArray(testSettings)) {
            const now = new Date();
            return testSettings.find(s => {
                const isStarted = (!s.start) || (now > new Date(s.start));
                const notEnded = (!s.end) || (new Date(s.end) > now);
                return isStarted && notEnded;
            });
        }
        return;
    }
    function getNextIncludeInTest(testSettings) {
        var _a;
        //
        //The test sample size specifies the percentage of
        //visitors who are included in the test. If the
        //size is 15, that means 15% of the visitors
        //will not see personalization.
        const value = Math.floor(Math.random() * 100);
        const sampleSize = (_a = testSettings.size) !== null && _a !== void 0 ? _a : 0;
        const include = sampleSize > value;
        logger.debug('Test manager - Visitor' + (include ? ' WILL ' : ' will NOT ') + 'be included in the test.', {
            value,
            testSettings,
        });
        return include;
    }
    return {
        disabled: false,
        getIsIncludedInTest,
    };
}
exports.getTestManager = getTestManager;
//# sourceMappingURL=index.js.map