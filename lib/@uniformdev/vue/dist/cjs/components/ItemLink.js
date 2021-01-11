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
exports.ItemLink = void 0;
exports.ItemLink = {
    functional: true,
    props: {
        item: {
            type: Object,
        },
    },
    render: function (createElement, context) {
        var item = context.props.item;
        if (!item) {
            throw new Error('no item');
        }
        var href = item.url;
        // in functional components, context.data should be passed along to the
        // `createElement` function in order to retain attributes and events
        // https://vuejs.org/v2/guide/render-function.html#Passing-Attributes-and-Events-to-Child-Elements-Components
        var data = __assign(__assign({}, context.data), { attrs: __assign(__assign({}, context.data.attrs), { href: href }) });
        return createElement('a', data, context.children);
    },
};
