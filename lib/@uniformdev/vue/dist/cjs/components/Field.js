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
exports.Field = void 0;
exports.Field = {
    functional: true,
    props: {
        item: {
            type: Object,
        },
        fieldName: {
            type: String,
        },
        fieldValue: {
            type: String,
        },
        path: {
            type: String,
        },
        format: {
            type: String,
        },
        tag: {
            type: String,
        },
    },
    render: function (createElement, context) {
        var props = context.props;
        var _a = props, item = _a.item, fieldName = _a.fieldName, fieldValue = _a.fieldValue, path = _a.path, format = _a.format, tag = _a.tag;
        if (item && fieldName && fieldValue) {
            throw new Error('The Field component cannot accept both (at the same time) "fieldValue" and a pair of "item" and "fieldName" attributes. Props: ' +
                JSON.stringify(props));
        }
        else if (item && !fieldName) {
            throw new Error('When "item" value is specified, the Field component cannot act without "fieldName" attribute. Props: ' +
                JSON.stringify(props));
        }
        var value = fieldValue || (!item || !fieldName ? '' : item.fields[fieldName.toLowerCase()]);
        // TODO: what is the use case for this?
        if (path) {
            path.split('.').forEach(function (word) {
                value = value && value[word];
            });
        }
        if (value) {
            switch ((format || '').toLowerCase()) {
                case 'date': {
                    var date = new Date(value);
                    var obj = date;
                    value = !isNaN(obj) ? date.toDateString() : value;
                    break;
                }
                case 'localedate': {
                    var date = new Date(value);
                    var obj = date;
                    value = !isNaN(obj) ? date.toLocaleDateString() : value;
                    break;
                }
                // case 'richtext': {
                //     if (!tag) {
                //         throw new Error('Field cannot render richtext format when no tag specified');
                //     }
                //     value = documentToHtmlString(value);
                //     break;
                // }
            }
        }
        // in functional components, context.data should be passed along to the
        // `createElement` function in order to retain attributes and events
        // https://vuejs.org/v2/guide/render-function.html#Passing-Attributes-and-Events-to-Child-Elements-Components
        var data = __assign({}, context.data);
        if (value) {
            if (tag === 'img') {
                data.attrs = __assign(__assign({}, data.attrs), { src: value });
            }
            else {
                data.domProps = __assign(__assign({}, data.domProps), { innerHTML: value });
            }
        }
        var element = createElement(tag || 'span', data, null);
        return element;
    },
};
