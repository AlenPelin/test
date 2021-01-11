var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React from 'react';
import { useSitecorePersonalization } from '@uniformdev/personalize-react';
import { Component } from './Component';
import { createRendering } from '../utils/createRendering';
import { parsePlaceholderKey, popVisibleRenderingsFromPlaceholdersMap } from '@uniformdev/common-client';
import { throwException, tryFormatGuid } from '@uniformdev/common';
var BasePlaceholder = /** @class */ (function (_super) {
    __extends(BasePlaceholder, _super);
    function BasePlaceholder(props, components, logger) {
        var _this = _super.call(this, props) || this;
        _this.logger = logger;
        // if (!components) throw new Error('no components');
        // it's okay because of magic button if (Object.getOwnPropertyNames(components).length <= 0) throw new Error('components are empty');
        if (props.placeholderKey === undefined || props.placeholderKey === null) {
            throw new Error('The props.placeholderKey is not defined');
        }
        _this.placeholderKey = parsePlaceholderKey(props.placeholderKey);
        _this.components = components;
        return _this;
    }
    BasePlaceholder.prototype.render = function () {
        var _this = this;
        var visibleRenderings = popVisibleRenderingsFromPlaceholdersMap(this.renderingContext.placeholders, this.placeholderKey, this.logger);
        var renderedRenderings = visibleRenderings.map(function (r, index) {
            return React.createElement(CreateRenderingWithPersonalization, __assign({}, { r: r, placeholderKey: _this.placeholderKey, index: index, components: _this.components, props: _this.props, logger: _this.logger }));
        });
        return React.createElement.apply(React, __spread([React.Fragment, {}], renderedRenderings));
    };
    return BasePlaceholder;
}(Component));
export { BasePlaceholder };
function CreateRenderingWithPersonalization(_a) {
    var _b;
    var r = _a.r, placeholderKey = _a.placeholderKey, index = _a.index, components = _a.components, props = _a.props, logger = _a.logger;
    var track = r.settings.Rules;
    if (!track) {
        return createRendering(r, placeholderKey, index, components, __assign(__assign({}, props), { loading: false }), logger);
    }
    var result = useSitecorePersonalization({ rendering: __assign(__assign({}, r), { dataSource: r.datasource, uid: tryFormatGuid(r.id, 'D') || throwException('r.id'), componentName: r.componentName || throwException('r.id') }), fields: (_b = props.renderingContext.page) === null || _b === void 0 ? void 0 : _b.fields, logger: logger, track: track });
    var loading = result.loading, error = result.error, personalizedProps = result.personalizedProps;
    //
    //
    if (error) {
        console.error("There was an error personalizing a component: " + error, Component);
    }
    if (!loading && personalizedProps) {
        r.datasource = personalizedProps.datasource || '';
    }
    //
    //
    return (React.createElement(React.Fragment, null, createRendering(r, placeholderKey, index, components, __assign(__assign({}, props), { loading: loading }), logger)));
}
//# sourceMappingURL=BasePlaceholder.js.map