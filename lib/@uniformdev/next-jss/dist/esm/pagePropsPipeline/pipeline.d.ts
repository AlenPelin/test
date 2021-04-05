import { PagePropsPipelineContext } from '../interfaces';
export declare const pagePropsPipeline: {
    addPreStep: (steps: import("@uniformdev/next").PipelineStep<PagePropsPipelineContext>[]) => void;
    addStep: (steps: import("@uniformdev/next").PipelineStep<PagePropsPipelineContext>[]) => void;
    addPostStep: (steps: import("@uniformdev/next").PipelineStep<PagePropsPipelineContext>[]) => void;
    run: (context: PagePropsPipelineContext) => Promise<PagePropsPipelineContext>;
};
//# sourceMappingURL=pipeline.d.ts.map