import { pagePropsPipeline } from '@uniformdev/next-jss';
import { getPropsFromDisconnectedMockStep } from './pagePropsPipeline/getPropsFromDisconnectedMockStep';
import { serverLogger } from '@uniformdev/common-server';
export var configure = function () {
    serverLogger.info('Configuring Server Pipelines');
    pagePropsPipeline.addPreStep([getPropsFromDisconnectedMockStep]);
};
//# sourceMappingURL=configure.js.map