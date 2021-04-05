"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedHtml = exports.inputHtml = exports.toString = void 0;
exports.toString = function () { return 'Anchor link with external href'; };
exports.inputHtml = "<p class=\"intro\">\n  Some test\n  <a href=\"https://uniform.DEV/?utm_campaign=SiteCore\">information and advice</a> is here to guide you.\n</p>";
exports.expectedHtml = "<p class=\"intro\">Some test<a href=\"https://uniform.DEV/?utm_campaign=SiteCore\">information and advice</a>is here to guide you.</p>";
//# sourceMappingURL=input-external-url.js.map