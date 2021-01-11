"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
var react_1 = __importDefault(require("react"));
// import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
// import { BLOCKS } from '@contentful/rich-text-types';
// import { throwException } from '@uniformdev/common';
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Field.prototype.render = function () {
        var props = this.props;
        var item = props.item, fieldName = props.fieldName, fieldValue = props.fieldValue, path = props.path, format = props.format, tag = props.tag, className = props.className, prefix = props.prefix, suffix = props.suffix, otherProps = __rest(props, ["item", "fieldName", "fieldValue", "path", "format", "tag", "className", "prefix", "suffix"]);
        if (item && fieldName && fieldValue) {
            throw new Error('The Field component cannot accept both (at the same time) "fieldValue" and a pair of "item" and "fieldName" attributes. Props: ' +
                JSON.stringify(this.props));
        }
        else if (item && !fieldName) {
            throw new Error('When "item" value is specified, the Field component cannot act without "fieldName" attribute. Props: ' +
                JSON.stringify(props));
        }
        var htmlProps = __assign({}, otherProps);
        var value = fieldValue || (!item || !fieldName ? '' : item.fields[fieldName.toLowerCase()]);
        if (path) {
            path.split('.').forEach(function (word) {
                value = value && value[word];
            });
        }
        if (value) {
            switch ((format || '').toLowerCase()) {
                case 'date':
                    {
                        var date = new Date(value);
                        var obj_1 = date;
                        value = !isNaN(obj_1) ? date.toDateString() : value;
                    }
                    break;
                case 'localedate':
                    {
                        var date = new Date(value);
                        var obj_2 = date;
                        value = !isNaN(obj_2) ? date.toLocaleDateString() : value;
                    }
                    break;
                    // case 'richtext':
                    //     {
                    //         if (!tag)
                    //             throw new Error('Field cannot render richtext format when no tag specified');
                    //         const options: any = {
                    //             renderNode: {
                    //                 [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                    //                     const { data } = node || throwException('node is undefined');
                    //                     const { target } = data || throwException('node.data is undefined');
                    //                     const { fields } =
                    //                         target || throwException('node.data.target is undefined');
                    //                     const { file, description, title } =
                    //                         fields || throwException('node.data.target.fields is undefined');
                    //                     const { contentType, url, details } =
                    //                         file || throwException('node.data.target.fields.file is undefined');
                    //                     const { image } =
                    //                         details ||
                    //                         throwException('node.data.target.fields.file.details is undefined');
                    //                     const { height, width } =
                    //                         image ||
                    //                         throwException(
                    //                             'node.data.target.fields.file.details.image is undefined'
                    //                         );
                    //                     if (!url) throwException('node.data.target.fields.file.url is undefined');
                    //                     if (contentType && contentType.startsWith('image/')) {
                    //                         return `<img src="${url}" height="${height || ''}" width="${width ||
                    //                             ''}" alt="${description || title || ''}"/>`;
                    //                     }
                    //                     throw new Error(`${contentType} is not supported`);
                    //                 },
                    //             },
                    //         };
                    //         value = documentToHtmlString(value, options);
                    //     }
                    break;
            }
        }
        if (value) {
            if (tag === 'img') {
                htmlProps.src = value;
            }
            else {
                htmlProps.dangerouslySetInnerHTML = {
                    __html: value,
                };
            }
        }
        if (className) {
            htmlProps['class'] = className;
        }
        var before = (value && prefix) || '';
        var after = (value && suffix) || '';
        var obj = tag ? react_1.default.createElement(tag || 'span', htmlProps, null) : value;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            before,
            obj,
            after));
    };
    return Field;
}(react_1.default.Component));
exports.Field = Field;
//# sourceMappingURL=Field.js.map