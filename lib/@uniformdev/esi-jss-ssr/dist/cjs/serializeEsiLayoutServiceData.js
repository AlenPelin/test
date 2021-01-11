"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeEsiLayoutServiceData = void 0;
var escapedCharacters = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029',
};
var escapedCharactersRegex = /[<>/\u2028\u2029]/g;
function serializeEsiLayoutServiceData(data) {
    // Serialize the data object using a custom serializer. This way we can
    // add `<esi:xxxxx />` tags along with JSON objects.
    var stringWriter = writer();
    serializeData(data, stringWriter);
    var serializedData = stringWriter.toString();
    return serializedData;
}
exports.serializeEsiLayoutServiceData = serializeEsiLayoutServiceData;
function writer() {
    var result = '';
    return {
        write: function (val) {
            result += val;
        },
        toString: function () { return result; },
    };
}
function serializeData(data, stringWriter) {
    writeObject(data, stringWriter);
}
function writeObject(obj, writer) {
    if (!obj) {
        return;
    }
    var keys = Object.keys(obj);
    if (keys.length === 0) {
        writer.write('{}');
        return;
    }
    // <esi:text>{html encoded}</esi:text>
    if (obj.componentName === 'EsiChoose' && obj.placeholders && obj.placeholders['esi-choose']) {
        writeEsiChoose(obj, writer);
    }
    else if (obj.componentName === 'EsiWhen' && obj.placeholders && obj.placeholders['esi-when']) {
        writeEsiWhen(obj, writer);
    }
    else if (obj.componentName === 'EsiOtherwise' && obj.placeholders && obj.placeholders['esi-otherwise']) {
        writeEsiOtherwise(obj, writer);
    }
    else if (obj.componentName === 'EsiInclude') {
        writeEsiInclude(obj, writer);
    }
    else if (obj.componentName === 'EsiForEach' && obj.placeholders && obj.placeholders['esi-for-each']) {
        writeEsiForEach(obj, writer);
    }
    else if (obj.componentName === 'EsiAssign') {
        writeEsiAssign(obj, writer);
    }
    else if (obj.componentName === 'EsiVars') {
        writeEsiVars(obj, writer);
    }
    else if (obj.componentName === 'EsiText') {
        writeEsiText(obj, writer);
    }
    else if (obj.componentName === 'EsiScript') {
        writeEsiScript(obj, writer);
    }
    else if (obj.componentName === 'EsiNoOutput' && obj.placeholders && obj.placeholders['esi-no-output']) {
        writeEsiNoOutput(obj, writer);
    }
    else {
        writer.write('{');
        var keyCounter_1 = 0;
        keys.forEach(function (key) {
            if (obj[key] !== undefined) {
                if (keyCounter_1 > 0) {
                    writer.write(',');
                }
                writer.write("\"" + key + "\":");
                writeValue(obj[key], key, writer);
                keyCounter_1 += 1;
            }
        });
        writer.write('}');
    }
}
function writeArray(arr, writer) {
    if (!arr || !Array.isArray(arr)) {
        return;
    }
    writer.write('[');
    var elemCounter = 0;
    arr.forEach(function (elem, index) {
        if (elem !== undefined) {
            if (elemCounter > 0) {
                writer.write(',');
            }
            writeValue(elem, index.toString(), writer);
            elemCounter += 1;
        }
    });
    writer.write(']');
}
function writeValue(val, key, writer) {
    // If value is undefined, we should still write a value otherwise we likely end up with broken JSON.
    // That said, functions that call `writeValue` should not pass `undefined` values, they _should_
    // check for undefined before calling `writeValue`.
    if (val === undefined) {
        writer.write('undefined');
        // `null` is a valid JSON value, so we test for it explicitly.
    }
    else if (val === null) {
        writer.write(null);
    }
    else if (typeof val === 'string') {
        // Use `JSON.stringify` to escape "standard" escape-able characters, e.g. double quote "
        // Then escape additional "unsafe" characters. This way we can leverage existing
        // JSON.stringify escaping without having to implement/maintain our own.
        var escapedVal = JSON.stringify(val).replace(escapedCharactersRegex, escapeCharacter);
        writer.write(escapedVal);
        // check for Array before `typeof 'object'` because `typeof` for an array is 'object'.
    }
    else if (Array.isArray(val)) {
        writeArray(val, writer);
    }
    else if (typeof val === 'object') {
        // objects are allowed to implement their own `toJSON` function to manage their
        // own serialization. We attempt to respect that even though Layout Service data
        // shouldn't contain custom methods... but who knows what craziness devs will get up to?
        if (val.toJSON && typeof val.toJSON === 'function') {
            var stringifyVal = JSON.stringify(val.toJSON(key));
            writer.write(stringifyVal);
        }
        else {
            writeObject(val, writer);
        }
    }
    else {
        writer.write(val);
    }
}
function writeEsiChoose(obj, writer) {
    writer.write('<esi:choose>');
    if (obj.placeholders) {
        obj.placeholders['esi-choose'].forEach(function (component) {
            writeObject(component, writer);
        });
    }
    writer.write('</esi:choose>');
}
function writeEsiWhen(obj, writer) {
    var attrs = obj.params
        ? Object.entries(obj.params)
            .map(function (_a) {
            var _b = __read(_a, 2), paramName = _b[0], paramValue = _b[1];
            return paramName + "=\"" + paramValue + "\"";
        })
            .join(' ')
        : '';
    writer.write("<esi:when " + attrs + ">");
    if (obj.placeholders) {
        obj.placeholders['esi-when'].forEach(function (component) {
            if (component.isEsi != true) {
                writer.write('<esi:text>');
            }
            writeObject(component, writer);
            if (component.isEsi != true) {
                writer.write('</esi:text>');
            }
        });
    }
    writer.write('</esi:when>');
}
function writeEsiOtherwise(obj, writer) {
    writer.write("<esi:otherwise>");
    if (obj.placeholders) {
        obj.placeholders['esi-otherwise'].forEach(function (component) {
            if (component.isEsi != true) {
                writer.write('<esi:text>');
            }
            writeObject(component, writer);
            if (component.isEsi != true) {
                writer.write('</esi:text>');
            }
        });
    }
    writer.write('</esi:otherwise>');
}
function writeEsiInclude(obj, writer) {
    var attrs = obj.params
        ? Object.entries(obj.params)
            .map(function (_a) {
            var _b = __read(_a, 2), paramName = _b[0], paramValue = _b[1];
            return paramName + "=\"" + paramValue + "\"";
        })
            .join(' ')
        : '';
    writer.write("<esi:include " + attrs + " />");
}
function writeEsiForEach(obj, writer) {
    var attrs = obj.params
        ? Object.entries(obj.params)
            .map(function (_a) {
            var _b = __read(_a, 2), paramName = _b[0], paramValue = _b[1];
            return paramName + "=\"" + paramValue + "\"";
        })
            .join(' ')
        : '';
    writer.write("<esi:foreach " + attrs + ">");
    if (obj.placeholders) {
        obj.placeholders['esi-for-each'].forEach(function (component) {
            if (component.isEsi != true) {
                writer.write('<esi:text>');
            }
            writeObject(component, writer);
            if (component.isEsi != true) {
                writer.write('</esi:text>');
            }
        });
    }
    writer.write('</esi:foreach>');
}
function writeEsiAssign(obj, writer) {
    var attrs = obj.params
        ? Object.entries(obj.params)
            .map(function (_a) {
            var _b = __read(_a, 2), paramName = _b[0], paramValue = _b[1];
            return paramName + "=\"" + paramValue + "\"";
        })
            .join(' ')
        : '';
    writer.write("<esi:assign " + attrs + " />");
}
function writeEsiVars(obj, writer) {
    var _a;
    var value = (_a = obj.params) === null || _a === void 0 ? void 0 : _a.value;
    if (!value) {
        return;
    }
    writer.write("<esi:vars>" + value + "</esi:vars>");
}
function writeEsiText(obj, writer) {
    var _a;
    var value = (_a = obj.params) === null || _a === void 0 ? void 0 : _a.value;
    if (!value) {
        return;
    }
    writer.write("<esi:text>" + value + "</esi:text>");
}
function writeEsiScript(obj, writer) {
    var _a;
    var script = (_a = obj.params) === null || _a === void 0 ? void 0 : _a.script;
    if (!script) {
        return;
    }
    writer.write("<esi:text><script>" + script + "</script></esi:text>");
}
function writeEsiNoOutput(obj, writer) {
    if (obj.placeholders) {
        obj.placeholders['esi-no-output'].forEach(function (component) {
            writeObject(component, writer);
        });
    }
}
function escapeCharacter(char) {
    return escapedCharacters[char];
}
//# sourceMappingURL=serializeEsiLayoutServiceData.js.map