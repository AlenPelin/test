import { Logger } from '@uniformdev/common';
/**
 * Algorithm used to calculate decay for a value.
 */
export declare type DecayType = 'simple' | 'compound' | 'default';
export declare type DecayTimeUnit = 'days' | 'hours' | 'minutes' | 'seconds' | 'default';
export declare type DecayRounding = 'up' | 'down' | 'closest' | 'none' | 'default';
/**
 * Settings that specify how decay is applied to a value.
 */
export interface DecaySettings {
    /** Algorithm used to calculate decay for a value. */
    type?: DecayType;
    /**
     * The unit of measure that describes the difference
     * between two dates. For example, "day" means that
     * the difference between two dates is expressed in
     * the number of days.
     * */
    timeUnit?: DecayTimeUnit;
    /**
     * The number of time units that must pass before
     * decay is applied. For example, if the increment
     * is 2 and the unit is days and 5 days have passed,
     * decay will apply 2 times.
     */
    timeIncrement?: number;
    /**
     * Number from 0 to 100 that represents the percentage
     * by which a value decays per unit/increment of time.
     * */
    rate?: number;
    /**
     * Decay is calculated using decimal values but may
     * be need to be rounded when non-negative integers
     * are required. This setting specifies how to handle
     * rounding the value that is returned.
     * */
    round?: DecayRounding;
}
/**
 * Gets the default decay settings.
 */
export declare function getDefaultDecaySettings(): DecaySettings;
/**
 * Applies decay to the specified values.
 * @param value
 * @param periods
 * @param settings
 * @param logger
 */
export declare function doDecay(value: number, periods: number, settings: DecaySettings, logger: Logger): number;
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
export declare function getDifferenceAsTimeIncrements(oldDate: (Date | string), newDate: (Date | string), settings: DecaySettings, logger: Logger): number;
//# sourceMappingURL=decay.d.ts.map