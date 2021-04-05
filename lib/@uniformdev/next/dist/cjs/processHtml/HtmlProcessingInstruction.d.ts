/**
 * This is used with the html-to-react
 * package to allow you to process an
 * html tag and convert it to a React element
 */
export interface HtmlProcessingInstruction {
    replaceChildren?: boolean;
    shouldProcessNode: ShouldProcessNodeFunction;
    processNode: ProcessNodeFunction;
}
/**
 * This is used to pre-process any html tags
 * before they get converted to react
 */
export interface HtmlPreProcessingInstruction {
    shouldPreprocessNode: ShouldProcessNodeFunction;
    preprocessNode: ProcessNodeFunction;
}
interface HtmlToReactNode {
    name: string;
    type: string;
    data?: any;
    attribs: any;
    children: HtmlToReactNode[];
}
interface ShouldProcessNodeFunction {
    (node: HtmlToReactNode): boolean;
}
interface ProcessNodeFunction {
    (node: HtmlToReactNode, children: any, index: number): any;
}
export {};
//# sourceMappingURL=HtmlProcessingInstruction.d.ts.map