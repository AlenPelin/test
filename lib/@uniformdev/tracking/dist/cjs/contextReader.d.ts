import { Visit } from './models/visit';
import { Visitor } from './models/visitor';
import { TrackedActivityResults } from './models/trackedActivity';
import { Logger } from '@uniformdev/common';
export declare type ContextSourceType = 'sitecore';
export interface ContextReaderContext {
    date: string;
    url: URL | undefined;
    logger?: Logger;
    context: any;
    visit: Visit;
    visitor: Visitor;
}
export interface ContextReader {
    getTrackedActivity(source: string | undefined, context: ContextReaderContext): TrackedActivityResults;
    type: string;
}
//# sourceMappingURL=contextReader.d.ts.map