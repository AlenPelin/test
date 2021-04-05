"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitecoreContext = exports.useSitecoreContext = void 0;
var react_1 = __importStar(require("react"));
var sitecoreJssReact = __importStar(require("@sitecore-jss/sitecore-jss-react"));
var SitecoreContextReactContext = sitecoreJssReact.SitecoreContextReactContext;
var sitecoreJssLegacy = sitecoreJssReact;
/*
  In sitecore-jss-react before version 15 the SitecoreContextFactory stores the
  current Sitecore context for the app.

  For example, whether the page is currently being edited, or the current language.
  Note that the export makes this essentially a singleton, so we can store state in it.

  The Sitecore context is generally updated on route change (/src/index.js).
  The `withSitecoreContext()` higher order component from `sitecore-jss-react`
  can be used to access the context from within a component.
*/
var contextFactory = typeof sitecoreJssLegacy.SitecoreContextFactory !== 'undefined'
    ? new sitecoreJssLegacy.SitecoreContextFactory()
    : null;
exports.useSitecoreContext = function () {
    var sitecoreContext = react_1.useContext(SitecoreContextReactContext);
    // Check to see if we are using the legacy factory
    if (typeof sitecoreContext.getSitecoreContext === 'function') {
        return sitecoreContext.getSitecoreContext();
    }
    else {
        return sitecoreContext.context;
    }
};
function SitecoreContext(_a) {
    var componentFactory = _a.componentFactory, children = _a.children, layoutData = _a.layoutData;
    var contextData = {
        route: null,
        itemId: null,
    };
    if (layoutData && layoutData.sitecore) {
        contextData.route = layoutData.sitecore.route;
        contextData.itemId = layoutData.sitecore.route && layoutData.sitecore.route.itemId;
        Object.assign(contextData, layoutData.sitecore.context);
    }
    if (contextFactory) {
        return (react_1.default.createElement(LegacySitecoreContext, { contextData: contextData, componentFactory: componentFactory }, children));
    }
    else {
        return (react_1.default.createElement(LatestSitecoreContext, { contextData: contextData, componentFactory: componentFactory }, children));
    }
}
exports.SitecoreContext = SitecoreContext;
function LegacySitecoreContext(_a) {
    var contextData = _a.contextData, componentFactory = _a.componentFactory, children = _a.children;
    if (contextFactory) {
        console.log('Setting contextData on legacy SitecoreContextFactory');
        contextFactory.setSitecoreContext(contextData);
    }
    contextFactory.setSitecoreContext(contextData);
    return (react_1.default.createElement(sitecoreJssLegacy.SitecoreContext, { componentFactory: componentFactory, contextFactory: contextFactory }, children));
}
function LatestSitecoreContext(_a) {
    var contextData = _a.contextData, componentFactory = _a.componentFactory, children = _a.children;
    return (react_1.default.createElement(sitecoreJssReact.SitecoreContext, { componentFactory: componentFactory, context: contextData }, children));
}
//# sourceMappingURL=SitecoreContext.js.map