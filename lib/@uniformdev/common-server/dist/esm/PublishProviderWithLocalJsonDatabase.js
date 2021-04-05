import { readFileSync, writeFileSync, existsSync } from 'fs';
import { throwException } from '@uniformdev/common';
var PublishProviderWithLocalJsonDatabase = /** @class */ (function () {
    function PublishProviderWithLocalJsonDatabase(dbPath, logger) {
        this.dbPath = dbPath;
        this.db = existsSync(dbPath) ? JSON.parse(readFileSync(dbPath).toString()) : {};
        this.logger = logger;
        this.logger.info('PublishProviderWithLocalJsonDatabase initialized with JSON file database at: ' + dbPath);
    }
    Object.defineProperty(PublishProviderWithLocalJsonDatabase.prototype, "site", {
        get: function () {
            return this.db['site'] || {};
        },
        set: function (value) {
            this.logger.debug('PublishProviderWithLocalJsonDatabase saved site data: ', this.site);
            this.db['site'] = value || throwException('value must be defined');
            writeFileSync(this.dbPath, JSON.stringify(this.db));
        },
        enumerable: false,
        configurable: true
    });
    return PublishProviderWithLocalJsonDatabase;
}());
export { PublishProviderWithLocalJsonDatabase };
//# sourceMappingURL=PublishProviderWithLocalJsonDatabase.js.map