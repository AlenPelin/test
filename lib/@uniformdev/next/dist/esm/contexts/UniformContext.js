var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useContext, useMemo, useState } from 'react';
import { buildProcessingInstructions, } from '../processHtml';
export var UniformContext = React.createContext(null);
export var useUniformContext = function () {
    var value = useContext(UniformContext);
    if (value === null) {
        throw new Error('Cannot useUniformContext without a UniformContextProvider');
    }
    return value;
};
export function UniformContextProvider(_a) {
    var children = _a.children, logger = _a.logger, componentMap = _a.componentMap, htmlProcessingInstructions = _a.htmlProcessingInstructions, htmlPreProcessingInstructions = _a.htmlPreProcessingInstructions;
    var _b = __read(useState({
        componentMap: componentMap,
        logger: logger,
        htmlProcessingInstructions: htmlProcessingInstructions,
        htmlPreProcessingInstructions: htmlPreProcessingInstructions,
    }), 2), state = _b[0], setState = _b[1];
    var value = useMemo(function () {
        var patchState = function (newState) {
            setState(__assign(__assign({}, state), newState));
        };
        var setComponentMap = function (componentMap) { return patchState({ componentMap: componentMap }); };
        var componentFactory = function (componentName) {
            return state.componentMap[componentName];
        };
        return __assign(__assign({}, state), { htmlProcessingInstructions: buildProcessingInstructions(logger, state.htmlProcessingInstructions), htmlPreProcessingInstructions: state.htmlPreProcessingInstructions || [], setComponentMap: setComponentMap,
            componentFactory: componentFactory });
    }, [state]);
    return React.createElement(UniformContext.Provider, { value: value }, children);
}
//# sourceMappingURL=UniformContext.js.map