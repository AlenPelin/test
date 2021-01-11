var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SitecorePersonalizationContextProvider } from './SitecorePersonalizationContext';
import { useSitecorePersonalization } from './useSitecorePersonalization';
const jssContextData = {
    sitecore: {
        context: {
            pageEditing: false,
            site: { name: 'website' },
            pageState: 'normal',
            language: 'en',
            personalization: {
                rules: {
                    'rendering-1': [
                        {
                            id: 'rendering-1-rule-1',
                            name: 'Always true, with dependency',
                            condition: 'return true;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-1',
                            dependencies: ["something"],
                        },
                        {
                            id: null,
                            name: 'Default',
                            condition: 'return true;',
                            data: '22222222-2222-2222-2222-222222222222',
                            component: 'component-1',
                        },
                    ],
                    'rendering-2': [
                        {
                            id: 'rendering-2-rule-1',
                            name: 'Always false, no dependency',
                            condition: 'return false;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-1',
                        },
                        {
                            id: null,
                            name: 'Default',
                            condition: 'return true;',
                            data: '22222222-2222-2222-2222-222222222222',
                            component: 'component-1',
                        },
                    ],
                    'rendering-3': [
                        {
                            id: 'rendering-3-rule-1',
                            name: 'Always true, no dependency',
                            condition: 'return true;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-1',
                        },
                        {
                            id: null,
                            name: 'Default',
                            condition: 'return true;',
                            data: '22222222-2222-2222-2222-222222222222',
                            component: 'component-1',
                        },
                    ],
                    'rendering-4': [
                        {
                            id: 'rendering-4-rule-1',
                            name: 'Always true, no dependency',
                            condition: 'return true;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-1',
                        },
                        {
                            id: null,
                            name: 'Default',
                            condition: 'return true;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-2',
                        },
                    ],
                    'rendering-5': [
                        {
                            id: 'rendering-5-rule-1',
                            name: 'Always true, no dependency',
                            condition: 'return true;',
                            data: '22222222-2222-2222-2222-222222222222',
                            component: 'component-1',
                        },
                        {
                            id: null,
                            name: 'Default',
                            condition: 'return true;',
                            data: '11111111-1111-1111-1111-111111111111',
                            component: 'component-2',
                        },
                    ],
                    'rendering-6': [],
                },
                data: {
                    '11111111-1111-1111-1111-111111111111': {
                        title: { value: 'datasource-1 data' },
                    },
                    '22222222-2222-2222-2222-222222222222': {
                        title: { value: 'datasource-2 data' },
                    },
                    '33333333-3333-3333-3333-333333333333': {
                        title: { value: 'datasource-3 data' },
                    },
                },
            },
        },
        route: {
            itemId: 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'
        },
    }
};
const Example = (props) => {
    const { loading, error, personalizedProps } = useSitecorePersonalization(props);
    if (error) {
        return React.createElement("div", { "data-testid": "error" }, "error");
    }
    if (loading) {
        return React.createElement("div", { "data-testid": "loading" }, "loading");
    }
    return React.createElement("div", { "data-testid": "content" }, personalizedProps === null || personalizedProps === void 0 ? void 0 : personalizedProps.fields.title.value);
};
const Example2 = (props) => {
    const { loading, error, personalizedProps } = useSitecorePersonalization(props);
    if (error) {
        return React.createElement("div", { "data-testid": "error2" }, "error");
    }
    if (loading) {
        return React.createElement("div", { "data-testid": "loading2" }, "loading");
    }
    return React.createElement("div", { "data-testid": "content2" }, personalizedProps === null || personalizedProps === void 0 ? void 0 : personalizedProps.fields.title.value);
};
describe('useSitecorePersonalization', () => {
    // const defaultTestSettings = {
    //     sampleSize: 15,
    //     endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // };
    describe('when personalization is disabled', () => {
        it('should render default content when personalization is disabled', () => {
            const props = {
                rendering: {
                    uid: 'rendering-1',
                },
                fields: {
                    title: { value: 'Non-Personalized Data' },
                },
            };
            render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss", disabled: true },
                React.createElement(Example, Object.assign({}, props))));
            expect(screen.queryByTestId('loading')).toBeNull();
            expect(screen.getByTestId('content')).toHaveTextContent('Non-Personalized Data');
        });
    });
    describe('when no rules are assigned to rendering', () => {
        it('should render default content when rendering has no rules assigned', () => {
            const props = {
                rendering: {
                    uid: 'unknown-rendering',
                },
                fields: {
                    title: { value: 'Non-Personalized Data' },
                },
            };
            render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss" },
                React.createElement(Example, Object.assign({}, props))));
            expect(screen.queryByTestId('loading')).toBeNull();
            expect(screen.getByTestId('content')).toHaveTextContent('Non-Personalized Data');
        });
    });
    describe('when rules have no dependencies', () => {
        describe('when rule matches', () => {
            describe('when data source changes', () => {
                it('should render default content when data source changes when rules have no dependencies', () => __awaiter(void 0, void 0, void 0, function* () {
                    const props = {
                        rendering: {
                            uid: 'rendering-3',
                        },
                        fields: {
                            title: { value: 'Non-Personalized Data' },
                        },
                    };
                    render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss" },
                        React.createElement(Example, Object.assign({}, props))));
                    expect(screen.getByTestId('loading')).toBeInTheDocument();
                    yield waitFor(() => screen.getByTestId('content'));
                    expect(screen.getByTestId('content')).toHaveTextContent('datasource-1 data');
                }));
            });
            describe('when component changes', () => {
                it('should render different component when component changes when rules have no dependencies', () => __awaiter(void 0, void 0, void 0, function* () {
                }));
            });
        });
        describe('when no rule matches', () => {
            describe('default rule has no data source specified', () => {
                it('should use the item as the data source', () => {
                });
            });
            describe('default rule has data source specified', () => {
                it('should use the data source specified on the rule', () => {
                });
            });
        });
        describe('when multiple components are presents', () => {
            describe('when no personalization is configured', () => {
                it('default data sources are used on both components', () => {
                });
            });
            describe('when personalization is configured on one component', () => {
                it('the personalized component renders properly and the non-personalized component renders properly', () => __awaiter(void 0, void 0, void 0, function* () {
                    const props3 = {
                        rendering: {
                            uid: 'rendering-3',
                        },
                        fields: {
                            title: { value: 'Non-Personalized Data' },
                        },
                    };
                    const props6 = {
                        rendering: {
                            uid: 'rendering-6',
                        },
                        fields: {
                            title: { value: 'Non-Personalized Data' },
                        },
                    };
                    render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss" },
                        React.createElement(Example, Object.assign({}, props3)),
                        React.createElement(Example2, Object.assign({}, props6))));
                    expect(screen.getByTestId('loading')).toBeInTheDocument();
                    expect(screen.getByTestId('content2')).toBeInTheDocument();
                    yield waitFor(() => screen.getByTestId('content'));
                    yield waitFor(() => screen.getByTestId('content2'));
                    expect(screen.getByTestId('content')).toHaveTextContent('datasource-1 data');
                    expect(screen.getByTestId('content2')).toHaveTextContent('Non-Personalized Data');
                }));
            });
            describe('when personalization is configured on both component', () => {
                it('both personalized components render properly', () => __awaiter(void 0, void 0, void 0, function* () {
                    const props3 = {
                        rendering: {
                            uid: 'rendering-3',
                        },
                        fields: {
                            title: { value: 'Non-Personalized Data' },
                        },
                    };
                    const props5 = {
                        rendering: {
                            uid: 'rendering-5',
                        },
                        fields: {
                            title: { value: 'Non-Personalized Data' },
                        },
                    };
                    render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss" },
                        React.createElement(Example, Object.assign({}, props3)),
                        React.createElement(Example2, Object.assign({}, props5))));
                    expect(screen.getByTestId('loading')).toBeInTheDocument();
                    expect(screen.getByTestId('loading2')).toBeInTheDocument();
                    yield waitFor(() => screen.getByTestId('content'));
                    yield waitFor(() => screen.getByTestId('content2'));
                    expect(screen.getByTestId('content')).toHaveTextContent('datasource-1 data');
                    expect(screen.getByTestId('content2')).toHaveTextContent('datasource-2 data');
                }));
            });
        });
    });
    describe('when a subscriber is added', () => {
        it('subscription is called when state changes', () => __awaiter(void 0, void 0, void 0, function* () {
            let countTimesTriggered = 0;
            let countTimesValuesChanged = 0;
            const props = {
                rendering: {
                    uid: 'rendering-3',
                },
                fields: {
                    title: { value: 'Non-Personalized Data' },
                },
            };
            render(React.createElement(SitecorePersonalizationContextProvider, { contextData: jssContextData, contextDataSource: "jss", subscriptions: (subscribe) => subscribe("state-changed", e => {
                    countTimesTriggered++;
                    if (e.changes) {
                        countTimesValuesChanged++;
                    }
                }) },
                React.createElement(Example, Object.assign({}, props))));
            expect(countTimesTriggered).toBe(1);
            expect(countTimesValuesChanged).toBe(0);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
            yield waitFor(() => screen.getByTestId('content'));
            expect(countTimesTriggered).toBe(2);
            expect(countTimesValuesChanged).toBe(1);
        }));
    });
});
//# sourceMappingURL=useSitecorePersonalization.test.js.map