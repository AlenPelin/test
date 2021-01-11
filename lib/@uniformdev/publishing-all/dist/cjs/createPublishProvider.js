"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublishProvider = void 0;
var common_1 = require("@uniformdev/common");
var publishing_azureblobstorage_1 = require("@uniformdev/publishing-azureblobstorage");
var common_server_1 = require("@uniformdev/common-server");
function createPublishProvider(options) {
    var config = options.config;
    var provider = common_1.getEnv(config.env, 'UNIFORM_PUBLISH_TARGET');
    switch (provider.toLowerCase()) {
        case 'none':
        case 'fake':
            return new common_server_1.FakePublishProvider(options);
        case 'custom':
            return new common_server_1.CustomPublishProvider(options);
        case 'azureblob':
            return new publishing_azureblobstorage_1.AzurePublishProvider(options);
    }
    throw new Error('Publish provider is not supported: ' + provider);
}
exports.createPublishProvider = createPublishProvider;
//# sourceMappingURL=createPublishProvider.js.map