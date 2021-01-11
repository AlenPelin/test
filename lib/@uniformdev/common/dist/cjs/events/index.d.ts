export * from './subscriptions';
export * from './queue';
export interface UniformEvent {
    type: string;
    when: Date;
    /**
     * If true, the event should not be published to any subscribers.
     */
    silent?: boolean;
}
export interface Description {
    id: string;
    description: string;
}
export interface Change {
    before: string;
    after: string;
}
//# sourceMappingURL=index.d.ts.map