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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placeholder = void 0;
var createRendering_1 = require("../utils/createRendering");
var common_client_1 = require("@uniformdev/common-client");
exports.Placeholder = {
    name: 'Placeholder',
    // by default, any attributes that are not recognized as props will be applied to the root element
    // of the child component. We don't really want that, we want to just pass the "unknown" attributes
    // along to child components as props. setting `inheritAttrs` to false helps ensure this behavior.
    inheritAttrs: false,
    props: {
        placeholderKey: {
            type: String,
            required: true,
        },
        componentMap: {
            type: Function,
            required: true,
        },
        renderingContext: {
            type: Object,
            required: true,
        },
        logger: {
            type: Object,
            required: true,
        },
    },
    render: function (createElement) {
        var _this = this;
        var props = __assign(__assign({}, this.$props), this.$attrs);
        var placeholders = props.renderingContext.placeholders;
        var visibleRenderings = common_client_1.popVisibleRenderingsFromPlaceholdersMap(placeholders, props.placeholderKey, this.logger);
        var renderedRenderings = visibleRenderings.map(function (r, index) {
            return createRendering_1.createRendering(r, _this.placeholderKey, index, props.componentMap, props, createElement);
        });
        return createElement('div', {}, renderedRenderings);
    },
};
