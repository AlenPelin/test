import { doDecay } from './decay';
var nullLogger = {
    debug: function () { },
    error: function () { },
    info: function () { },
    trace: function () { },
    warn: function () { },
};
describe('Simple rate decay', function () {
    var type = 'simple';
    var timeUnit = 'days';
    var timeIncrement = 1;
    it('Simple decay with no rounding needed.', function () {
        var settings = {
            type: type,
            round: 'down',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 10
        };
        var originalValue = 200;
        var difference = 2;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 160;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Simple decay with rounding up.', function () {
        var settings = {
            type: type,
            round: 'up',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 10;
        var difference = 1;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 10;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Simple decay with rounding down.', function () {
        var settings = {
            type: type,
            round: 'down',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 10;
        var difference = 1;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 9;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Simple decay with rounding closest.', function () {
        //
        //
        var settingsUp = {
            type: type,
            round: 'closest',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 2
        };
        //
        //
        var settingsDown = {
            type: type,
            round: 'closest',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 6
        };
        var originalValue = 10;
        var difference = 1;
        var expectedValueUp = 10;
        var expectedValueDown = 9;
        var actualValueUp = doDecay(originalValue, difference, settingsUp, nullLogger);
        expect(actualValueUp).toEqual(expectedValueUp);
        var actualValueDown = doDecay(originalValue, difference, settingsDown, nullLogger);
        expect(actualValueDown).toEqual(expectedValueDown);
    });
});
describe('Compound rate decay', function () {
    var type = 'compound';
    var timeUnit = 'days';
    var timeIncrement = 1;
    it('Compound decay with no rounding needed.', function () {
        var settings = {
            type: type,
            round: 'down',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 10
        };
        var originalValue = 200;
        var difference = 2;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 162;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Compound decay with no rounding.', function () {
        var settings = {
            type: type,
            round: 'none',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 10;
        var difference = 1;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 9.9;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Compound decay with rounding up.', function () {
        var settings = {
            type: type,
            round: 'up',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 200;
        var difference = 2;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 197;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Compound decay with rounding down.', function () {
        var settings = {
            type: type,
            round: 'down',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 200;
        var difference = 2;
        var actualValue = doDecay(originalValue, difference, settings, nullLogger);
        var expectedValue = 196;
        expect(actualValue).toEqual(expectedValue);
    });
    it('Compound decay with rounding closest.', function () {
        //
        //
        var settingsUp = {
            type: type,
            round: 'closest',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 6
        };
        //
        //
        var settingsDown = {
            type: type,
            round: 'closest',
            timeUnit: timeUnit,
            timeIncrement: timeIncrement,
            rate: 1
        };
        var originalValue = 200;
        var difference = 2;
        var expectedValueUp = 177;
        var expectedValueDown = 196;
        var actualValueUp = doDecay(originalValue, difference, settingsUp, nullLogger);
        expect(actualValueUp).toEqual(expectedValueUp);
        var actualValueDown = doDecay(originalValue, difference, settingsDown, nullLogger);
        expect(actualValueDown).toEqual(expectedValueDown);
    });
});
//# sourceMappingURL=decay.tests.js.map