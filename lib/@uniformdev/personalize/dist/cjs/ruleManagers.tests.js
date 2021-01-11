"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./ruleManagers/index");
describe('getSitecorePersonalizationRuleManager', () => {
    const personalizedDataSourceId = 'dcc25f7b-0161-45c4-a03e-7753a397e286';
    const trueRule = {
        id: '8c4ef7e3-c7e0-4122-a815-6c0dc2c60278',
        name: 'Some rule 2',
        condition: 'return true;',
        data: personalizedDataSourceId,
    };
    const falseRule = {
        id: '38f4d439-b5a8-48c9-8290-226590263325',
        name: 'Some rule 1',
        condition: 'return false;',
        data: '',
    };
    const defaultRule = {
        id: null,
        name: 'Default rule',
        condition: '',
        data: '',
    };
    const personalizedDataSource = {
        [personalizedDataSourceId]: {
            title: { value: 'Personalized Data' },
        },
    };
    const definitions = {
        rules: {
            '70886a78-86e8-48b8-b023-46d0816c8400': [falseRule, trueRule],
            '1d158f66-1759-41b7-b281-d1083200a491': [falseRule],
            '92f59d44-8fd8-4d71-824a-e80e9aa5c151': [falseRule, defaultRule],
        },
        data: Object.assign({}, personalizedDataSource),
    };
    const item = { id: '', name: '' };
    function createSettings(uid, dataSource) {
        return {
            componentName: '',
            uid,
            dataSource
        };
    }
    ;
    const args = {
        item,
        definitions,
    };
    describe('getRulesForRendering', () => {
        it('should return rules when renderingUid is found in rules data', () => {
            const renderingUid = '70886a78-86e8-48b8-b023-46d0816c8400';
            const settings = createSettings(renderingUid);
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            expect(ruleManager.getRulesForRendering(settings)).toMatchObject(definitions.rules[settings.uid]);
        });
        it('should return undefined when renderingUid is not found in rules data', () => {
            const renderingUid = 'some-unknown-guid';
            const settings = createSettings(renderingUid);
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            expect(ruleManager.getRulesForRendering(settings)).toBeUndefined;
        });
    });
    describe('renderingHasPersonalizationRules', () => {
        it('should return true when renderingUid is found in rules data', () => {
            const renderingUid = '70886a78-86e8-48b8-b023-46d0816c8400';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            expect(ruleManager.renderingHasPersonalizationRules(settings)).toBe(true);
        });
        it('should return false when renderingUid is not found in rules data', () => {
            const renderingUid = 'some-unknown-guid';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            expect(ruleManager.renderingHasPersonalizationRules(settings)).toBe(false);
        });
    });
    describe('getFirstMatchingRule', () => {
        it('should return the first rule found with true condition', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderingUid = '70886a78-86e8-48b8-b023-46d0816c8400';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            const rule = yield ruleManager.getFirstMatchingRule(settings);
            expect(rule).toMatchObject(trueRule);
        }));
        it('should return null if no rules evaluate to true', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderingUid = '1d158f66-1759-41b7-b281-d1083200a491';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            const rule = yield ruleManager.getFirstMatchingRule(settings);
            expect(rule).toBeNull();
        }));
        it('should return the default rule if exists and no rules evaluate to true', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderingUid = '92f59d44-8fd8-4d71-824a-e80e9aa5c151';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            const rule = yield ruleManager.getFirstMatchingRule(settings);
            expect(rule).toMatchObject(defaultRule);
        }));
        it('should reject if no rules are found for the rendering', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderingUid = 'some-other-guid';
            const settings = createSettings(renderingUid);
            const args = {
                item,
                definitions,
            };
            const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
            try {
                yield ruleManager.getFirstMatchingRule(settings);
            }
            catch (err) {
                expect(err).toBeDefined();
            }
            //return expect(ruleManager.getFirstMatchingRule(settings)).rejects.toBeTruthy();
        }));
    });
    describe('runRuleActions', () => {
        describe('when datasource has not changed', () => {
            it('should return unchanged result', () => __awaiter(void 0, void 0, void 0, function* () {
                const args = {
                    item,
                    definitions,
                };
                const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
                const rule = trueRule;
                const settings = createSettings('', personalizedDataSourceId);
                const result = yield ruleManager.runRuleActions(rule, settings);
                expect(result.changes).toBeUndefined();
            }));
        });
        describe('when datasource is undefined', () => {
            describe('when default datasource is set', () => {
                describe('when item id matches', () => {
                    it('should return unchanged result', () => {
                    });
                });
                describe('when item id does not match', () => {
                    it('should return unchanged result', () => {
                    });
                });
            });
            describe('when default datasource is not set', () => {
                describe('when item id matches', () => {
                    it('should return unchanged result', () => {
                    });
                });
                describe('when item id does not match', () => {
                    it('should return changed result', () => {
                    });
                });
            });
        });
        describe('when datasource changed', () => {
            describe('when is not included in test', () => {
                it('should return changed result', () => __awaiter(void 0, void 0, void 0, function* () {
                    const args = {
                        item,
                        definitions
                    };
                    const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
                    const rule = trueRule;
                    const settings = createSettings('', '');
                    const result = yield ruleManager.runRuleActions(rule, settings);
                    expect(result).toMatchObject({
                        changed: true,
                        dataSource: personalizedDataSourceId,
                        fields: personalizedDataSource[personalizedDataSourceId],
                    });
                }));
            });
            describe('when is included in test', () => {
                it('should return un-changed result', () => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    const args = {
                        item,
                        definitions,
                    };
                    const ruleManager = index_1.getSitecorePersonalizationRuleManager(args);
                    const rule = trueRule;
                    const settings = createSettings('', '');
                    const result = yield ruleManager.runRuleActions(rule, settings);
                    expect((_a = result.changes) === null || _a === void 0 ? void 0 : _a.data).toBeDefined();
                    expect((_c = (_b = result.changes) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.before).not.toBe((_e = (_d = result.changes) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.after);
                }));
            });
        });
    });
});
//# sourceMappingURL=ruleManagers.tests.js.map