import { getNormalizedScores } from './scoring';
export function getPatternMatcher(getDistance) {
    return new DefaultPatternMatcher(getDistance !== null && getDistance !== void 0 ? getDistance : getSquaredDistance);
}
var DefaultPatternMatcher = /** @class */ (function () {
    function DefaultPatternMatcher(getDistance) {
        this.getDistance = getDistance;
    }
    DefaultPatternMatcher.prototype.match = function (scores, profile) {
        if (!scores || !profile) {
            return undefined;
        }
        var values = Object.keys(scores).map(function (profileKeyId) {
            return scores[profileKeyId];
        });
        return getMatch(values, profile, this.getDistance);
    };
    return DefaultPatternMatcher;
}());
function getMatch(visitorValues, profile, getDistance) {
    var patterns = profile === null || profile === void 0 ? void 0 : profile.patterns;
    if (!patterns) {
        return undefined;
    }
    //
    //If the visitor has no values, no pattern should match.
    if (!visitorValues.find(function (value) { return value > 0; })) {
        return undefined;
    }
    var bestMatchId = undefined;
    var bestMatchPattern;
    var shortestDistance = 0;
    Object.keys(patterns).forEach(function (patternId) {
        var pattern = patterns[patternId];
        var normalizedPatternScores = getNormalizedScores(pattern.keys, profile.keys);
        var patternValues = Object.keys(normalizedPatternScores).map(function (patternId) {
            return normalizedPatternScores[patternId];
        });
        var distance = getDistance(visitorValues, patternValues);
        if (shortestDistance > distance || bestMatchId == undefined) {
            shortestDistance = distance;
            bestMatchId = patternId;
            bestMatchPattern = pattern;
        }
    });
    //
    //
    if (!bestMatchId) {
        return undefined;
    }
    return {
        name: bestMatchPattern === null || bestMatchPattern === void 0 ? void 0 : bestMatchPattern.name,
        patternId: bestMatchId,
        distance: shortestDistance
    };
}
/**
 * Get Euclidean squared distance.
 * @param a
 * @param b
 */
function getSquaredDistance(a, b) {
    var sum = 0;
    var n;
    for (n = 0; n < a.length; n++) {
        sum += Math.pow(a[n] - b[n], 2);
    }
    return Math.sqrt(sum);
}
//# sourceMappingURL=patternMatchers.js.map