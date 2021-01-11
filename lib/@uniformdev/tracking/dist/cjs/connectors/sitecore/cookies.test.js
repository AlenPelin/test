"use strict";
exports.__esModule = true;
var cookies_1 = require("./cookies");
describe('getCookieValueFromVisitor', function () {
    it('should return undefined when no patterns have matched', function () {
        var visitor = {
            id: "1",
            updated: "",
            visits: [],
            data: {}
        };
        var value = cookies_1.getCookieValueFromVisitor('patterns', visitor);
        expect(value).toBeUndefined();
    });
    it('should return pattern matches when patterns are matched', function () {
        var visitor = {
            id: "1",
            updated: "",
            visits: [],
            data: {
                patterns: {
                    data: {
                        profile1: {
                            patternId: "p1"
                        },
                        profile2: {
                            patternId: "p2"
                        }
                    }
                }
            }
        };
        var value = cookies_1.getCookieValueFromVisitor('patterns', visitor);
        expect(value).toBe("profile1=p1,profile2=p2");
    });
    it('should return undefined when no profiles have been scored', function () {
        var visitor = {
            id: "1",
            updated: "",
            visits: [],
            data: {}
        };
        var value = cookies_1.getCookieValueFromVisitor('profiles', visitor);
        expect(value).toBeUndefined();
    });
    it('should return profiles when profiles have been scored', function () {
        var visitor = {
            id: "1",
            updated: "",
            visits: [],
            data: {
                profiles: {
                    data: {
                        profile1: {
                            keys: {
                                key1: {
                                    value: 1
                                },
                                key2: {
                                    value: 2
                                }
                            }
                        },
                        profile2: {
                            keys: {
                                key3: {
                                    value: 3
                                },
                                key4: {
                                    value: 4
                                }
                            }
                        }
                    }
                }
            }
        };
        var value = cookies_1.getCookieValueFromVisitor('profiles', visitor);
        expect(value).toBe("profile1=key1|1+key2|2,profile2=key3|3+key4|4");
    });
});
//# sourceMappingURL=cookies.test.js.map