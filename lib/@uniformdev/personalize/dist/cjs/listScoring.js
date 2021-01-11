"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListScoring = void 0;
const common_1 = require("@uniformdev/common");
class ListScoring {
    constructor(settings) {
        const { conditions, logger, testManager, tracker } = settings;
        this.conditions = conditions || [];
        this.logger = logger !== null && logger !== void 0 ? logger : common_1.getNullLogger();
        this.testManager = testManager;
        this.tracker = tracker;
    }
    calculateWeight(weight, score) {
        // Fixed number weight
        if (typeof weight === 'number') {
            return weight;
        }
        // Provided function to weight dynamically
        if (typeof weight === 'function') {
            const calculated = weight(score);
            return calculated;
        }
        return 1; // no weight
    }
    executeCondition(condition, scoringParams) {
        // Executes a single condition, store the score
        let { score, matches } = condition.rule(scoringParams);
        // Apply any weighting that might apply to this condition
        if (score && condition.weight) {
            const weight = this.calculateWeight(condition.weight, score);
            score *= weight;
        }
        // Return the score from this condition
        return {
            score,
            matches
        };
    }
    shouldListBePersonalized(_visitor, _visit) {
        const isIncluded = true; //this.testManager ? this.testManager.getIsIncludedInTest() : true;
        return isIncluded;
    }
    buildRuleSummary(matchData) {
        const pieces = [];
        Object.keys(matchData).forEach(condition => {
            const matches = matchData[condition];
            const description = `${condition}: ${Object.keys(matches).join(', ')}`;
            pieces.push(description);
        });
        const full = pieces.join(' - ');
        return full;
    }
    buildChangesAfter(matchData) {
        const pieces = [];
        Object.keys(matchData).forEach(condition => {
            const matches = matchData[condition];
            const description = `${Object.keys(matches).join(', ')} List Items`;
            pieces.push(description);
        });
        const full = pieces.join(' - ');
        return full;
    }
    triggerPersonalizationListEvents(visitor, isIncludedInTest, eventData, matchData) {
        if (!eventData.component) {
            this.logger.warn("PersonalizationList - component data is null");
            return;
        }
        if (!eventData.page) {
            this.logger.warn("PersonalizationList - page data is null");
            return;
        }
        if (this.tracker) {
            const data = {
                changes: {
                    component: {
                        before: "Default Conditions",
                        after: this.buildChangesAfter(matchData)
                    }
                },
                component: eventData.component,
                page: eventData.page,
                rule: {
                    id: "Condition Matches",
                    description: this.buildRuleSummary(matchData)
                },
                isIncludedInTest
            };
            const activity = {
                type: "personalization",
                date: new Date().toISOString(),
                data
            };
            debugger;
            this.tracker.event("visit-activity", activity, {
                visitorId: visitor.id
            });
        }
    }
    execute(visitor, visit, list, eventData) {
        let itemWasScored = false;
        // Build our list that will track the overall score of items
        const scoredItems = list.map((item) => ({
            score: 0,
            item
        }));
        // Check to see if this list should be personalized for this visit/visitor
        const shouldPersonalize = this.shouldListBePersonalized(visitor, visit);
        const matchData = {};
        // Process each item one condition at a time
        this.conditions.forEach((condition) => {
            // Check to see if the condition exposes an initialize function, call it if so
            const conditionData = condition.initialize ? condition.initialize() : {};
            // Iterate all of the list items
            for (var i = 0; i < list.length; i++) {
                const item = list[i];
                // Build props that will be passed to the condition being executed
                const scoringParams = Object.assign({ visitor, visit, item }, conditionData);
                // Calculate the score value from this condition
                const { score, matches } = this.executeCondition(condition, scoringParams);
                // Check if the score was changed my this condition, add it to the final item score
                if (score) {
                    itemWasScored = true;
                    scoredItems[i].score += score;
                }
                if (matches && matches.length && condition.getRuleDescription) {
                    const conditionName = condition.getRuleDescription();
                    const conditionData = matchData[conditionName] || {};
                    matches.forEach((match) => {
                        conditionData[match] = true;
                    });
                    matchData[conditionName] = conditionData;
                }
                else if (!condition.getRuleDescription) {
                    this.logger.warn('Condition does not implement getRuleDescription.');
                }
            }
        });
        // If the list should not be personalized, do not sort it.
        if (shouldPersonalize) {
            // Set back to false, we'll be returning the list in the order it was passed in as
            itemWasScored = false;
            // Sort items by score
            scoredItems.sort((a, b) => (b.score > a.score) ? 1 : -1);
        }
        // Fire off any tracker events to indicate this was personalized
        this.triggerPersonalizationListEvents(visitor, shouldPersonalize, eventData, matchData);
        // Return sorted items, extracted from result object.
        return {
            items: scoredItems,
            personalized: itemWasScored
        };
    }
}
exports.ListScoring = ListScoring;
//# sourceMappingURL=listScoring.js.map