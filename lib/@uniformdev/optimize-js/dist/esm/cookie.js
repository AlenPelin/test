import { getCookie, setCookie, removeCookie } from '@uniformdev/tracking';
export { getCookie, setCookie, removeCookie };
export function getCookieValues(name) {
    var value = getCookie(name);
    if (value) {
        return value.split(",");
    }
    return [];
}
//# sourceMappingURL=cookie.js.map