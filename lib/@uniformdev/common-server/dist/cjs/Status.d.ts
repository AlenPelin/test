/// <reference types="node" />
export declare class Status {
    status?: string;
    message?: string;
    processed?: number;
    total?: number;
    error?: any;
    time?: any;
    static writeStatus(outputDir: string, obj: Status): void;
    static writeTimer(outputDir: string): void;
    static readStatus(outputDir: string): Promise<Status | undefined>;
    static createTimer(outputDir: string): NodeJS.Timeout;
    static updateProgress(obj: Status, outputDir: string): Promise<void>;
}
//# sourceMappingURL=Status.d.ts.map