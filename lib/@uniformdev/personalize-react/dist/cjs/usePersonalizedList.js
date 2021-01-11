"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersonalizedList = void 0;
const react_1 = require("react");
const useUniformPersonalization_1 = require("./useUniformPersonalization");
const personalize_1 = require("@uniformdev/personalize");
const SitecorePersonalizationContext_1 = require("./SitecorePersonalizationContext");
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
exports.usePersonalizedList = (props) => {
    var _a;
    const { conditions, list } = props;
    const { visit, visitor, tracker } = useUniformPersonalization_1.useUniformPersonalization();
    const [personalizedList, setPersonalizedList] = react_1.useState(null);
    const [wasPersonalized, setWasPersonalized] = react_1.useState(null);
    const [refreshTrackingFlag, setRefreshingTrackingFlag] = react_1.useState(null);
    const context = react_1.useContext(SitecorePersonalizationContext_1.SitecorePersonalizationContext);
    const testManager = (_a = context === null || context === void 0 ? void 0 : context.personalizationManager) === null || _a === void 0 ? void 0 : _a.testManager;
    const personalizer = new personalize_1.ListScoring({
        conditions,
        testManager,
        tracker
    });
    // Personalizer causes `visit` to change, causing infinite loop.
    const updateRef = react_1.useRef(true);
    react_1.useEffect(() => {
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