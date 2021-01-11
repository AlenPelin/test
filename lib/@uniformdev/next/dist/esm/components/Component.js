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
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    /**
     *
     */
    function Component(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Component.prototype, "renderingContext", {
        get: function () {
            return this.props.renderingContext;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "item", {
        get: function () {
            return this.renderingContext.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "page", {
        get: function () {
            return this.renderingContext.page;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "home", {
        get: function () {
            return this.renderingContext.home;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "children", {
        get: function () {
            var item = this.item;
            return (item && item.children) || [];
        },
        enumerable: false,
        configurable: true
    });
    return Component;
}(React.Component));
export { Component };
//# sourceMappingURL=Component.js.map