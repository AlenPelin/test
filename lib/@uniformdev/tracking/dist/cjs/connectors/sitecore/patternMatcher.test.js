"use strict";
exports.__esModule = true;
var patternMatchers_1 = require("./patternMatchers");
var patternMatcher = patternMatchers_1.getPatternMatcher();
var KEYS = {
    "key-1": {
        "name": "Key 1",
        "value": 0
    },
    "key-2": {
        "name": "Key 2",
        "value": 0
    }
};
var PATTERNS = {
    "pattern-1": {
        name: "Pattern 1",
        keys: {
            "key-1": 10,
            "key-2": 0
        }
    },
    "pattern-2": {
        name: "Pattern 2",
        keys: {
            "key-1": 0,
            "key-2": 10
        }
    }
};
var PROFILE_1_WITH_NO_PATTERNS_SUM = {
    name: "Profile 1",
    type: "Sum",
    decay: 0,
    keys: KEYS,
    patterns: {}
};
var PROFILE_1_WITH_PATTERNS_SUM = {
    name: "Profile 1",
    type: "Sum",
    decay: 0,
    keys: KEYS,
    patterns: PATTERNS
};
describe('match patterns', function () {
    it('should not match when no patterns are defined on the profile', function () {
        var values = { "key-1": 10 };
        var profile = PROFILE_1_WITH_NO_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeUndefined();
    });
    it('should not match when no values are set', function () {
        var values = {};
        var profile = PROFILE_1_WITH_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeUndefined();
    });
    it('should not match when values are zero', function () {
        var values = { "key-1": 0, "key-2": 0 };
        var profile = PROFILE_1_WITH_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeUndefined();
    });
    it('should match pattern 2 when values are exact match', function () {
        var values = { "key-1": 0, "key-2": 10 };
        var profile = PROFILE_1_WITH_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeDefined();
        expect(match === null || match === void 0 ? void 0 : match.patternId).toBe('pattern-2');
    });
    it('should match pattern 2 when best match', function () {
        var values = { "key-1": 2, "key-2": 4 };
        var profile = PROFILE_1_WITH_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeDefined();
        expect(match === null || match === void 0 ? void 0 : match.patternId).toBe('pattern-2');
    });
    it('should match the first pattern when multiple patterns are an equal match', function () {
        var values = { "key-1": 5, "key-2": 5 };
        var profile = PROFILE_1_WITH_PATTERNS_SUM;
        var match = patternMatcher.match(values, profile);
        expect(match).toBeDefined();
        expect(match === null || match === void 0 ? void 0 : match.patternId).toBe('pattern-1');
    });
});
//# sourceMappingURL=patternMatcher.test.js.map