"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagePropsPipeline = void 0;
var next_1 = require("@uniformdev/next");
var getPropsFromRenderingHostRequestStep_1 = require("./steps/getPropsFromRenderingHostRequestStep");
var getPropsFromStaticFilesStep_1 = require("./steps/getPropsFromStaticFilesStep");
var getPropsFromApiStep_1 = require("./steps/getPropsFromApiStep");
var preProcessSteps = [];
var buildPropsSteps = [
    getPropsFromRenderingHostRequestStep_1.getPropsFromRenderingHostRequestStep,
    getPropsFromStaticFilesStep_1.getPropsFromStaticFilesStep,
    getPropsFromApiStep_1.getPropsFromApiStep,
];
var postProcessSteps = [];
exports.pagePropsPipeline = next_1.makePipeline(buildPropsSteps, preProcessSteps, postProcessSteps);
//# sourceMappingURL=pipeline.js.map