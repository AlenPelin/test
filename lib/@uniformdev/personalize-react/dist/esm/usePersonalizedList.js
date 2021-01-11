import { useState, useEffect, useContext, useRef } from 'react';
import { useUniformPersonalization } from './useUniformPersonalization';
import { ListScoring } from '@uniformdev/personalize';
import { SitecorePersonalizationContext } from './SitecorePersonalizationContext';
const formatSitecoreId = (id) => {
    return id && id.replace(/[^a-z0-9-]+/gi, "").toLocaleLowerCase();
};
const buildTrackingMetadata = (route, rendering) => {
    const response = {};
    if (route) {
        const { name, itemId } = route;
        response.page = {
            description: name,
            id: formatSitecoreId(itemId)
        };
    }
    if (rendering) {
        const { dataSource, componentName } = rendering;
        response.component = {
            description: componentName,
            id: formatSitecoreId(dataSource)
        };
    }
    return response;
};
export const usePersonalizedList = (props) => {
    var _a;
    const { conditions, list } = props;
    const { visit, visitor, tracker } = useUniformPersonalization();
    const [personalizedList, setPersonalizedList] = useState(null);
    const [wasPersonalized, setWasPersonalized] = useState(null);
    const [refreshTrackingFlag, setRefreshingTrackingFlag] = useState(null);
    const context = useContext(SitecorePersonalizationContext);
    const testManager = (_a = context === null || context === void 0 ? void 0 : context.personalizationManager) === null || _a === void 0 ? void 0 : _a.testManager;
    const personalizer = new ListScoring({
        conditions,
        testManager,
        tracker
    });
    // Personalizer causes `visit` to change, causing infinite loop.
    const updateRef = useRef(true);
    useEffect(() => {
        if (updateRef.current) {
            updateRef.current = false;
            return;
        }
        if (visitor && visit) {
            updateRef.current = true;
            const eventData = buildTrackingMetadata(props.route, props.rendering);
            // Once visitor and visit are initialized, execute personalization
            const { items, personalized } = personalizer.execute(visitor, visit, list, eventData);
            // Store personalized list in state
            setPersonalizedList(items);
            setWasPersonalized(personalized);
        }
    }, [visitor, visit, list, refreshTrackingFlag]);
    const refreshTracking = () => {
        setRefreshingTrackingFlag(new Date().valueOf());
    };
    return { personalizedList, wasPersonalized, refreshTracking };
};
//# sourceMappingURL=usePersonalizedList.js.map