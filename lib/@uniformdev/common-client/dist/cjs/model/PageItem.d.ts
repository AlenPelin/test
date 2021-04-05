import { DataItem } from './DataItem';
import { RenderingNode } from './RenderingNode';
import { PageMvcNode } from './PageMvcNode';
export interface PageItem extends DataItem {
    children?: DataItem[];
    renderings?: RenderingNode[];
    datasources?: any;
    url?: string;
    mvc?: PageMvcNode;
}
//# sourceMappingURL=PageItem.d.ts.map