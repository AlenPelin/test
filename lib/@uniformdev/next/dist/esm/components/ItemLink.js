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
import React from 'react';
import { SmartLink } from './SmartLink';
var ItemLink = /** @class */ (function (_super) {
    __extends(ItemLink, _super);
    function ItemLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemLink.prototype.render = function () {
        var lang = 'en'; //this.props.lang || 'en';
        var item = this.props.item;
        if (!item)
            throw new Error('no item');
        var href = (lang === 'en' ? '' : '/' + lang) + item.url;
        return React.createElement(SmartLink, { href: href }, this.props.children);
    };
    return ItemLink;
}(React.Component));
export { ItemLink };
//# sourceMappingURL=ItemLink.js.map