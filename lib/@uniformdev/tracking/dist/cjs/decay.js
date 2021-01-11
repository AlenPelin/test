"use strict";
exports.__esModule = true;
exports.getDifferenceAsTimeIncrements = exports.doDecay = exports.getDefaultDecaySettings = void 0;
var DEFAULT_DECAY_RATE = 3;
/**
 * Gets the default decay settings.
 */
function getDefaultDecaySettings() {
    return {
        rate: DEFAULT_DECAY_RATE,
        round: 'default',
        timeUnit: 'default',
        timeIncrement: 1,
        type: 'default'
    };
}
exports.getDefaultDecaySettings = getDefaultDecaySettings;
/**
 * Applies decay to the specified values.
 * @param value
 * @param periods
 * @param settings
 * @param logger
 */
function doDecay(value, periods, settings, logger) {
    if (value <= 0 || periods <= 0) {
        return 0;
    }
    var decay = getDecay(periods, settings.type, settings.rate, logger);
    var valueWithDecay = value * decay;
    return doRounding(valueWithDecay, settings.round, logger);
}
exports.doDecay = doDecay;
/**
 * Calculates the difference between two dates
 * and then determines the number of intervals
 * that difference can be described with.
 *
 * For example, if there are 36 hours between
 * the two dates and the settings specify the
 * decay rate is every 4 hours, 9 is returned.
 * @param oldDate
 * @param newDate
 * @param settings
 * @param logger
 */
function getDifferenceAsTimeIncrements(oldDate, newDate, settings, logger) {
    var _a, _b;
    var time = 0;
    switch ((_a = settings.timeUnit) !== null && _a !== void 0 ? _a : 'default') {
        case 'seconds':
            time = 1000;
            break;
        case 'minutes':
            time = 1000 * 60;
            break;
        case 'hours':
            time = 1000 * 60 * 60;
            break;
        case 'days':
        case 'default':
            time = 1000 * 60 * 60 * 24;
            break;
        default:
            logger.error("The specified decay unit is not supported. No decay will be used.", { settings: settings });
    }
    if (time == 0) {
        return 0;
    }
    var difference = getDateDifference(oldDate, newDate);
    var diffByTime = Math.abs(difference / time);
    var increment = (_b = settings.timeIncrement) !== null && _b !== void 0 ? _b : 1;
    var diffByIncrement = Math.floor(diffByTime / increment);
    return diffByIncrement;
}
exports.getDifferenceAsTimeIncrements = getDifferenceAsTimeIncrements;
function getDate(value) {
    if (typeof value === 'string') {
        return new Date(value);
    }
    return value;
}
function getDateDifference(oldDate, newDate) {
    return getDate(newDate).getTime() - getDate(oldDate).getTime();
}
function getDecay(periods, type, rate, logger) {
    if (type === void 0) { type = 'default'; }
    if (rate === void 0) { rate = DEFAULT_DECAY_RATE; }
    switch (type) {
        case 'compound':
            return Math.pow((1 - rate / 100), periods);
        case 'simple':
        case 'default':
            return (1 - (rate / 100 * periods));
        default:
            logger.error("The specified decay type is not supported. No decay will be used.", { type: type });
    }
    return 1;
}
function doRounding(value, rounding, logger) {
    if (rounding === void 0) { rounding = 'default'; }
    switch (rounding) {
        case 'none':
            return value;
        case 'down':
            return Math.floor(value);
        case 'up':
            return Math.ceil(value);
        case 'closest':
        case 'default':
            break;
        default:
            logger.error("The specified rounding option is not supported. Default rounding will be used.", { value: value, rounding: rounding });
    }
    return Math.round(value);
}
//# sourceMappingURL=decay.js.map