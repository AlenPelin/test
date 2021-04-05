import { DictionaryDataPipelineContext } from '../interfaces';
export declare const dictionaryDataPipeline: {
    addPreStep: (steps: import("@uniformdev/next").PipelineStep<DictionaryDataPipelineContext>[]) => void;
    addStep: (steps: import("@uniformdev/next").PipelineStep<DictionaryDataPipelineContext>[]) => void;
    addPostStep: (steps: import("@uniformdev/next").PipelineStep<DictionaryDataPipelineContext>[]) => void;
    run: (context: DictionaryDataPipelineContext) => Promise<DictionaryDataPipelineContext>;
};
//# sourceMappingURL=pipeline.d.ts.map