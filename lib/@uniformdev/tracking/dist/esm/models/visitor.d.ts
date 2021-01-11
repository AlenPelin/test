import { Visit } from './visit';
export declare class Visitor {
    constructor(id: string, init?: Partial<Visitor>);
    id: string;
    updated: string;
    visits: Visit[];
    data: any;
}
export declare function getCurrentVisit(visitor: Visitor): Visit | undefined;
//# sourceMappingURL=visitor.d.ts.map