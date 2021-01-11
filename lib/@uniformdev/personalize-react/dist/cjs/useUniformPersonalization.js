"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUniformPersonalization = void 0;
const react_1 = require("react");
const tracking_react_1 = require("@uniformdev/tracking-react");
exports.useUniformPersonalization = () => {
    const [visitor, setVisitor] = react_1.useState(undefined);
    const [visit, setVisit] = react_1.useState(undefined);
    const [tracker, setTracker] = react_1.useState(undefined);
    const context = react_1.useContext(tracking_react_1.TrackerContext);
    react_1.useEffect(() => {
        const unsubs = [];
        unsubs.push(context.subscriptions.subscribe("tracker-set", e => {
            if (e.tracker) {
                setTracker(e.tracker);
                unsubs.push(e.tracker.subscribe("tracking-finished", e2 => {
                    if (e2.visitor) {
                        setVisitor(e2.visitor);
                    }
                    if (e2.visit) {
                        setVisit(e2.visit);
                    }
                }));
            }
        }));
        return function cleanup() {
            unsubs.forEach(unsub => unsub());
        };
    }, []);
    return { visitor, visit, tracker };
};
//# sourceMappingURL=useUniformPersonalization.js.map