"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniformContextProvider = exports.useUniformContext = exports.UniformContext = void 0;
var react_1 = __importStar(require("react"));
var processHtml_1 = require("../processHtml");
exports.UniformContext = react_1.default.createContext(null);
exports.useUniformContext = function () {
    var value = react_1.useContext(exports.UniformContext);
    if (value === null) {
        throw new Error('Cannot useUniformContext without a UniformContextProvider');
    }
    return value;
};
function UniformContextProvider(_a) {
    var children = _a.children, logger = _a.logger, componentMap = _a.componentMap, htmlProcessingInstructions = _a.htmlProcessingInstructions, htmlPreProcessingInstructions = _a.htmlPreProcessingInstructions;
    var _b = __read(react_1.useState({
        componentMap: componentMap,
        logger: logger,
        htmlProcessingInstructions: htmlProcessingInstructions,
        htmlPreProcessingInstructions: htmlPreProcessingInstructions,
    }), 2), state = _b[0], setState = _b[1];
    var value = react_1.useMemo(function () {
        var patchState = function (newState) {
            setState(__assign(__assign({}, state), newState));
        };
        var setComponentMap = function (componentMap) { return patchState({ componentMap: componentMap }); };
        var componentFactory = function (componentName) {
            return state.componentMap[componentName];
        };
        return __assign(__assign({}, state), { htmlProcessingInstructions: processHtml_1.buildProcessingInstructions(logger, state.htmlProcessingInstructions), htmlPreProcessingInstructions: state.htmlPreProcessingInstructions || [], setComponentMap: setComponentMap,
            componentFactory: componentFactory });
    }, [state]);
    return react_1.default.createElement(exports.UniformContext.Provider, { value: value }, children);
}
exports.UniformContextProvider = UniformContextProvider;
//# sourceMappingURL=UniformContext.js.map