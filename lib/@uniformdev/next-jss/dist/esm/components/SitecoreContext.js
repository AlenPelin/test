import React, { useContext } from 'react';
import * as sitecoreJssReact from '@sitecore-jss/sitecore-jss-react';
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
export var useSitecoreContext = function () {
    var sitecoreContext = useContext(SitecoreContextReactContext);
    // Check to see if we are using the legacy factory
    if (typeof sitecoreContext.getSitecoreContext === 'function') {
        return sitecoreContext.getSitecoreContext();
    }
    else {
        return sitecoreContext.context;
    }
};
export function SitecoreContext(_a) {
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
        return (React.createElement(LegacySitecoreContext, { contextData: contextData, componentFactory: componentFactory }, children));
    }
    else {
        return (React.createElement(LatestSitecoreContext, { contextData: contextData, componentFactory: componentFactory }, children));
    }
}
function LegacySitecoreContext(_a) {
    var contextData = _a.contextData, componentFactory = _a.componentFactory, children = _a.children;
    if (contextFactory) {
        console.log('Setting contextData on legacy SitecoreContextFactory');
        contextFactory.setSitecoreContext(contextData);
    }
    contextFactory.setSitecoreContext(contextData);
    return (React.createElement(sitecoreJssLegacy.SitecoreContext, { componentFactory: componentFactory, contextFactory: contextFactory }, children));
}
function LatestSitecoreContext(_a) {
    var contextData = _a.contextData, componentFactory = _a.componentFactory, children = _a.children;
    return (React.createElement(sitecoreJssReact.SitecoreContext, { componentFactory: componentFactory, context: contextData }, children));
}
//# sourceMappingURL=SitecoreContext.js.map