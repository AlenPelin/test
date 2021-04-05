import { makePipeline } from '@uniformdev/next';
import { getPropsFromRenderingHostRequestStep } from './steps/getPropsFromRenderingHostRequestStep';
import { getPropsFromStaticFilesStep } from './steps/getPropsFromStaticFilesStep';
import { getPropsFromApiStep } from './steps/getPropsFromApiStep';
var preProcessSteps = [];
var buildPropsSteps = [
    getPropsFromRenderingHostRequestStep,
    getPropsFromStaticFilesStep,
    getPropsFromApiStep,
];
var postProcessSteps = [];
export var pagePropsPipeline = makePipeline(buildPropsSteps, preProcessSteps, postProcessSteps);
//# sourceMappingURL=pipeline.js.map