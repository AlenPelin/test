import { FunctionalComponentOptions } from 'vue';
export interface FieldProps {
    item?: any;
    fieldName?: string;
    fieldValue?: string;
    path?: string;
    format?: string;
    tag?: string;
}
export declare const Field: FunctionalComponentOptions<FieldProps>;
