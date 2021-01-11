import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { MetaInfo } from 'vue-meta';
import { UniformConfig } from '@uniformdev/common';
export interface EnhancedRouterLinkProps {
    /**
     * Enables or disables link and datasource prefetch. When enabled, one or more `<link rel="preload" />`
     * tags will be added to the page `<head />`. Default: true.
     *
     * @type {boolean}
     * @default true
     * @memberof EnhancedRouterLinkProps
     */
    enableLinkPrefetch?: boolean;
    /**
     * When specified, the `href` value will be used as the link URL.
     * If `href` contains a value that appears to be an external URL, i.e. starts with `http` or `//`,
     * then the component will render a "standard" `<a />` element that does not interact with
     * the app router.
     * NOTE: if the `href` prop contains a value, the `item` prop value will be ignored.
     *
     * @type {string}
     * @memberof EnhancedRouterLinkProps
     */
    href?: string;
    /**
     * When specified, the `item.url` value will be used as the link URL.
     * If `item.url` contains a value that appears to be an external URL, i.e. starts with `http` or `//`,
     * then the component will render a "standard" `<a />` element that does not interact with
     * the app router.
     * NOTE: if the `href` prop contains a value, the `item` prop value will be ignored.
     *
     * @type {*}
     * @memberof EnhancedRouterLinkProps
     */
    item?: any;
    /**
     * An object containing properties that will be merged with existing `process.env` values.
     * This property can be used at runtime, if needed, to override `process.env` values
     * for a specific component instance.
     * @type {UniformConfig}
     * @memberof EnhancedRouterLinkProps
     */
    runtimeConfig?: UniformConfig;
}
interface VueMetaOptions {
    head?: MetaInfo | (() => MetaInfo);
}
export declare const EnhancedRouterLink: ThisTypedComponentOptionsWithRecordProps<Vue, any, any, any, EnhancedRouterLinkProps> & VueMetaOptions;
export {};
