"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishProviderWithLocalJsonDatabase = void 0;
var fs_1 = require("fs");
var common_1 = require("@uniformdev/common");
var PublishProviderWithLocalJsonDatabase = /** @class */ (function () {
    function PublishProviderWithLocalJsonDatabase(dbPath, logger) {
        this.dbPath = dbPath;
        this.db = fs_1.existsSync(dbPath) ? JSON.parse(fs_1.readFileSync(dbPath).toString()) : {};
        this.logger = logger;
        this.logger.info('PublishProviderWithLocalJsonDatabase initialized with JSON file database at: ' + dbPath);
    }
    Object.defineProperty(PublishProviderWithLocalJsonDatabase.prototype, "site", {
        get: function () {
            return this.db['site'] || {};
        },
        set: function (value) {
            this.logger.debug('PublishProviderWithLocalJsonDatabase saved site data: ', this.site);
            this.db['site'] = value || common_1.throwException('value must be defined');
            fs_1.writeFileSync(this.dbPath, JSON.stringify(this.db));
        },
        enumerable: false,
        configurable: true
    });
    return PublishProviderWithLocalJsonDatabase;
}());
exports.PublishProviderWithLocalJsonDatabase = PublishProviderWithLocalJsonDatabase;
//# sourceMappingURL=PublishProviderWithLocalJsonDatabase.js.map