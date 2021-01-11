import { useState, useEffect, useContext } from 'react';
import { TrackerContext } from '@uniformdev/tracking-react';
export const useUniformPersonalization = () => {
    const [visitor, setVisitor] = useState(undefined);
    const [visit, setVisit] = useState(undefined);
    const [tracker, setTracker] = useState(undefined);
    const context = useContext(TrackerContext);
    useEffect(() => {
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