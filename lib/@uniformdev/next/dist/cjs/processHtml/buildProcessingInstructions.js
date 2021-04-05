"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProcessingInstructions = void 0;
var buildDoctypeTag_1 = require("./elements/buildDoctypeTag");
var buildScriptTag_1 = require("./elements/buildScriptTag");
var buildLinkTag_1 = require("./elements/buildLinkTag");
var buildButtonTag_1 = require("./elements/buildButtonTag");
var buildInputTags_1 = require("./elements/buildInputTags");
var buildFormBuilderForm_1 = require("./elements/buildFormBuilderForm");
var buildCustomElements_1 = require("./elements/buildCustomElements");
var elements_1 = require("./elements");
/**
 * The in-built set of html processing instructions
 */
exports.buildProcessingInstructions = function (logger, htmlProcessingInstructions) {
    if (htmlProcessingInstructions === void 0) { htmlProcessingInstructions = []; }
    return __spread(htmlProcessingInstructions, [
        buildDoctypeTag_1.buildDoctypeTag(),
        buildScriptTag_1.buildScriptTag(logger),
        buildLinkTag_1.buildLinkTag(logger),
        buildButtonTag_1.buildButtonTag()
    ], buildInputTags_1.buildInputTags(), [
        buildFormBuilderForm_1.buildFormBuilderForm(),
        buildCustomElements_1.buildCustomElements(),
        elements_1.buildDefaultNodeProcessor(logger),
    ]).filter(Boolean);
};
//# sourceMappingURL=buildProcessingInstructions.js.map