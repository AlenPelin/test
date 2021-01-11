import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import Vue from 'vue';
import { RenderingContext } from '@uniformdev/common-client';
import { ComponentMap } from '../packageTypes/ComponentMap';
import { Logger } from '@uniformdev/common';
export interface PlaceholderProps {
    placeholderKey: string;
    componentMap: ComponentMap;
    renderingContext: RenderingContext;
    logger: Logger;
}
export declare const Placeholder: ThisTypedComponentOptionsWithRecordProps<Vue, any, any, any, PlaceholderProps>;
