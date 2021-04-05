export interface PipelineStep<Context> {
    name: string;
    run: (context: Context) => Promise<Context>;
}
export declare const makePipeline: <Context>(processSteps?: PipelineStep<Context>[], preProcessSteps?: PipelineStep<Context>[], postProcessSteps?: PipelineStep<Context>[]) => {
    addPreStep: (steps: PipelineStep<Context>[]) => void;
    addStep: (steps: PipelineStep<Context>[]) => void;
    addPostStep: (steps: PipelineStep<Context>[]) => void;
    run: (context: Context) => Promise<Context>;
};
//# sourceMappingURL=pipeline.d.ts.map