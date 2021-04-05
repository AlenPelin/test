"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;
var next_jss_1 = require("@uniformdev/next-jss");
var getPropsFromDisconnectedMockStep_1 = require("./pagePropsPipeline/getPropsFromDisconnectedMockStep");
var common_server_1 = require("@uniformdev/common-server");
exports.configure = function () {
    common_server_1.serverLogger.info('Configuring Server Pipelines');
    next_jss_1.pagePropsPipeline.addPreStep([getPropsFromDisconnectedMockStep_1.getPropsFromDisconnectedMockStep]);
};
//# sourceMappingURL=configure.js.map