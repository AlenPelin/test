import { HtmlProcessingInstruction } from '../HtmlProcessingInstruction';
/**
 * workaround to issue with "html-to-react" where
 * it chokes on elements with a hyphen in their name
 *
 * ie: <custom-element />
 *
 * https://github.com/aknuds1/html-to-react/issues/43
 */
export declare const buildCustomElements: () => HtmlProcessingInstruction;
//# sourceMappingURL=buildCustomElements.d.ts.map