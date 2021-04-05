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
export var makePipeline = function (processSteps, preProcessSteps, postProcessSteps) {
    if (processSteps === void 0) { processSteps = []; }
    if (preProcessSteps === void 0) { preProcessSteps = []; }
    if (postProcessSteps === void 0) { postProcessSteps = []; }
    return {
        addPreStep: function (steps) {
            steps.forEach(function (step) {
                preProcessSteps.push(step);
            });
        },
        addStep: function (steps) {
            steps.forEach(function (step) {
                processSteps.push(step);
            });
        },
        addPostStep: function (steps) {
            steps.forEach(function (step) {
                postProcessSteps.push(step);
            });
        },
        run: function (context) {
            return __spread(preProcessSteps, processSteps, postProcessSteps).reduce(function (result, step) { return result.then(step.run); }, Promise.resolve(context));
        },
    };
};
//# sourceMappingURL=pipeline.js.map