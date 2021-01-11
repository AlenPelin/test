import { getScorerSum, getScorerAverage, getScorerPercentage } from './scoring';
var PROFILE_DEFINITION_1 = {
    decay: 0,
    type: 'Sum',
    keys: {
        "profile-key-1": {
            name: "Profile Key 1",
            value: 10
        },
        "profile-key-2": {
            name: "Profile Key 2",
            value: 10
        },
    }
};
var PROFILE_DEFINITION_PERCENTAGE_1 = {
    decay: 0,
    type: 'Sum',
    keys: {
        "profile-key-1": {
            name: "Profile Key 1",
            value: 1
        },
        "profile-key-2": {
            name: "Profile Key 2",
            value: 3
        },
    }
};
var PROFILE_DEFINITION_PERCENTAGE_2 = {
    decay: 0,
    type: 'Sum',
    keys: {
        "profile-key-1": {
            name: "Profile Key 1",
            value: 2
        },
        "profile-key-2": {
            name: "Profile Key 2",
            value: 0
        },
    }
};
describe('profile scoring sum', function () {
    it('should add values when scoring with sum', function () {
        var score = getScorerSum();
        var currentValues = {
            "profile-key-1": 6,
            "profile-key-2": 2
        };
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_1, 0);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(1);
        expect(newValues.keys['profile-key-1']).toBe(16);
        expect(newValues.keys['profile-key-2']).toBe(12);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
    });
    it('values are scored even if they are not included in current values when scoring with sum', function () {
        var score = getScorerSum();
        var currentValues = {
            "profile-key-1": 6,
        };
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_1, 0);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(1);
        expect(newValues.keys['profile-key-1']).toBe(16);
        expect(newValues.keys['profile-key-2']).toBe(10);
        expect(newValues.keys['key-does-not-exist-in-profile']).toBeUndefined();
    });
    it('values that are not included in the profile definition are excluded from results when scoring with sum', function () {
        var score = getScorerSum();
        var currentValues = {
            "profile-key-1": 6,
            "key-does-not-exist-in-profile": 10
        };
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_1, 0);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(1);
        expect(newValues.keys['profile-key-1']).toBe(16);
        expect(newValues.keys['profile-key-2']).toBe(10);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
        expect(newValues.keys['key-does-not-exist-in-profile']).toBeUndefined();
    });
});
describe('profile scoring average', function () {
    it('should add values on the first pass when scoring with average', function () {
        var score = getScorerAverage();
        var currentValues = {};
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_1, 0);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(1);
        expect(newValues.keys['profile-key-1']).toBe(10);
        expect(newValues.keys['profile-key-2']).toBe(10);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
    });
    it('should add values on the second pass when using the same profile definition when scoring with average', function () {
        var score = getScorerAverage();
        var currentValues = {
            "profile-key-1": 6
        };
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_1, 1);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(2);
        expect(newValues.keys['profile-key-1']).toBe(8);
        expect(newValues.keys['profile-key-2']).toBe(5);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
    });
});
describe('profile scoring percentage', function () {
    //scores: 1,3 and 2,0
    it('should use the percentage on the first pass when scoring with percentage', function () {
        var score = getScorerPercentage();
        var currentValues = {};
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_PERCENTAGE_1, 0);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(1);
        expect(newValues.keys['profile-key-1']).toBe(.25);
        expect(newValues.keys['profile-key-2']).toBe(.75);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
    });
    it('should use the percentage on the second pass when using the same profile definition when scoring with percentage', function () {
        var score = getScorerPercentage();
        var currentValues = {
            "profile-key-1": .25,
            "profile-key-2": .75
        };
        var newValues = score(currentValues, 'profile-1', PROFILE_DEFINITION_PERCENTAGE_2, 1);
        expect(newValues).toBeDefined();
        expect(newValues.profileId).toBe('profile-1');
        expect(newValues.scoresChanged).toBe(true);
        expect(newValues.updateCount).toBe(2);
        expect(newValues.keys['profile-key-1']).toBe(.625);
        expect(newValues.keys['profile-key-2']).toBe(.375);
        expect(newValues.keys['profile-key-3']).toBeUndefined();
    });
});
//# sourceMappingURL=scoring.test.js.map