"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDictionaryData = void 0;
function fetchDictionaryData(language, _a) {
    var dataFetcher = _a.dataFetcher, sitecoreApiHost = _a.sitecoreApiHost, jssAppName = _a.jssAppName, sitecoreApiKey = _a.sitecoreApiKey, sitecoreSiteName = _a.sitecoreSiteName;
    var dictionaryServiceUrl = sitecoreApiHost + "/sitecore/api/jss/dictionary/" + jssAppName + "/" + language + "?sc_apikey=" + sitecoreApiKey + "&sc_site=" + sitecoreSiteName;
    return dataFetcher(dictionaryServiceUrl).then(function (response) {
        if (response.data && response.data.phrases) {
            return response.data.phrases;
        }
        return null;
    });
}
exports.fetchDictionaryData = fetchDictionaryData;
//# sourceMappingURL=fetchDictionaryData.js.map