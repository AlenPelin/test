import { Tracker } from './tracker';
import { Visit, Visitor } from '../models/index';
import { UniformGlobal } from '@uniformdev/common';
export interface UniformWindow extends Window {
    uniform?: UniformGlobalEx;
}
export interface UniformEvent {
}
interface UniformGlobalEx extends UniformGlobal {
    tracker?: Tracker;
    visit?: Visit;
    visitor?: Visitor;
    tracking?: any;
}
export {};
//# sourceMappingURL=global.d.ts.map