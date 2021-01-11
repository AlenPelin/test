"use strict";
exports.__esModule = true;
exports.getNormalizedScores = exports.getScorerPercentage = exports.getScorerAverage = exports.getScorerSum = exports.getScorer = void 0;
function getScorer(type) {
    switch (type) {
        case "Average":
            return getScorerAverage();
        case "Sum":
            return getScorerSum();
        case "Percentage":
            return getScorerPercentage();
        default:
            return undefined;
    }
}
exports.getScorer = getScorer;
function getScorerSum() {
    return function (currentScores, profileId, profile, updateCount) {
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var scoresChanged = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            if (profileKey.value != 0) {
                scoresChanged = true;
            }
            newScores[profileKeyId] += profileKey.value;
        });
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: updateCount + 1,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerSum = getScorerSum;
function getScorerAverage() {
    return function (currentScores, profileId, profile, updateCount) {
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var scoresChanged = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            if (profileKey.value != 0) {
                scoresChanged = true;
            }
            newScores[profileKeyId] = ((newScores[profileKeyId] * updateCount) + profileKey.value) / (updateCount + 1);
        });
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: updateCount + 1,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerAverage = getScorerAverage;
function getScorerPercentage() {
    return function (currentScores, profileId, profile, updateCount) {
        var sum = 0;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            sum += profileKey.value;
        });
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var newUpdateCount = sum > 0 ? updateCount + 1 : updateCount;
        var scoresChanged = false;
        if (sum > 0) {
            Object.keys(profile.keys).forEach(function (profileKeyId) {
                var profileKey = profile.keys[profileKeyId];
                if (profileKey.value != 0) {
                    scoresChanged = true;
                }
                newScores[profileKeyId] = ((newScores[profileKeyId] * updateCount) + (profileKey.value / sum)) / newUpdateCount;
            });
        }
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: newUpdateCount,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerPercentage = getScorerPercentage;
function getNormalizedScores(scores, profileKeys) {
    var normalizedScores = {};
    Object.keys(profileKeys).forEach(function (profileKeyId) {
        var _a;
        var currentScore = (_a = scores[profileKeyId]) !== null && _a !== void 0 ? _a : 0;
        normalizedScores[profileKeyId] = currentScore;
    });
    return normalizedScores;
}
exports.getNormalizedScores = getNormalizedScores;
//# sourceMappingURL=scoring.js.map