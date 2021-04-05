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
import { buildDoctypeTag } from './elements/buildDoctypeTag';
import { buildScriptTag } from './elements/buildScriptTag';
import { buildLinkTag } from './elements/buildLinkTag';
import { buildButtonTag } from './elements/buildButtonTag';
import { buildInputTags } from './elements/buildInputTags';
import { buildFormBuilderForm } from './elements/buildFormBuilderForm';
import { buildCustomElements } from './elements/buildCustomElements';
import { buildDefaultNodeProcessor } from './elements';
/**
 * The in-built set of html processing instructions
 */
export var buildProcessingInstructions = function (logger, htmlProcessingInstructions) {
    if (htmlProcessingInstructions === void 0) { htmlProcessingInstructions = []; }
    return __spread(htmlProcessingInstructions, [
        buildDoctypeTag(),
        buildScriptTag(logger),
        buildLinkTag(logger),
        buildButtonTag()
    ], buildInputTags(), [
        buildFormBuilderForm(),
        buildCustomElements(),
        buildDefaultNodeProcessor(logger),
    ]).filter(Boolean);
};
//# sourceMappingURL=buildProcessingInstructions.js.map