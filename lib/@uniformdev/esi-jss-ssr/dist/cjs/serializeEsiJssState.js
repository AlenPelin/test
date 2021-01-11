"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeEsiJssState = void 0;
var serialize_javascript_1 = __importDefault(require("serialize-javascript"));
var serializeEsiLayoutServiceData_1 = require("./serializeEsiLayoutServiceData");
function serializeEsiJssState(state) {
    // Place a string token into the state object to denote where the serialized ESI data should be placed after serialization.
    // This allows us to serialize data that may need ESI tags separately from other state data.
    // The ESI Layout Service data serializer may not be as robust as `JSON.stringify` or `serialize-javascript`.
    // And who knows what people are trying to put into state data outside of Layout Service?
    var placeholders;
    if (state.routeData && state.routeData.placeholders) {
        placeholders = __assign({}, state.routeData.placeholders);
    }
    else {
        placeholders = __assign({}, state.sitecore.route.placeholders);
    }
    var serializedPlaceholders = serializeEsiLayoutServiceData_1.serializeEsiLayoutServiceData(placeholders);
    // Replace the existing placeholders object with a string value that we can replace later.
    var placeholdersReplaceToken = '^^^^placeholders_replacement_token^^^^';
    if (state.routeData && state.routeData.placeholders) {
        state.routeData.placeholders = placeholdersReplaceToken;
    }
    else {
        state.sitecore.route.placeholders = placeholdersReplaceToken;
    }
    // Serialize the state that does not contain placeholders using "normal" serialization.
    var serializedState = serialize_javascript_1.default(state, { isJSON: true });
    // This replace call assumes that `serializedState` will be unformatted, i.e. no line breaks or indents.
    serializedState = serializedState.replace("\"" + placeholdersReplaceToken + "\"", serializedPlaceholders);
    return serializedState;
}
exports.serializeEsiJssState = serializeEsiJssState;
//# sourceMappingURL=serializeEsiJssState.js.map