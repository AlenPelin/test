import { LayoutDataPipelineContext } from '../interfaces';
export declare const layoutDataPipeline: {
    addPreStep: (steps: import("@uniformdev/next").PipelineStep<LayoutDataPipelineContext>[]) => void;
    addStep: (steps: import("@uniformdev/next").PipelineStep<LayoutDataPipelineContext>[]) => void;
    addPostStep: (steps: import("@uniformdev/next").PipelineStep<LayoutDataPipelineContext>[]) => void;
    run: (context: LayoutDataPipelineContext) => Promise<LayoutDataPipelineContext>;
};
//# sourceMappingURL=pipeline.d.ts.map