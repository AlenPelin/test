import { useEffect } from 'react';
let cachedScripts = {};
/**
 * Runs after the scripts are loaded.
 * @callback scriptsLoadedCallback
 */
/**
 * Loads a script and calls a callback when the script is finished loading.
 * @param {TrackerScripts} scripts - Urls for the scripts to load.
 * @param {scriptsLoadedCallback} callback - Function that is called after the scripts are loaded.
 */
export function useScripts(scripts, callback) {
    useEffect(() => {
        //
        //Return if no urls were specified.
        const ids = Object.keys(scripts);
        if (ids.length == 0) {
            return;
        }
        //
        //Return if all urls are already cached.
        const idsNotCached = [];
        ids.forEach(id => {
            const cachedUrl = cachedScripts[id];
            if (cachedUrl != scripts[id]) {
                idsNotCached.push(id);
            }
        });
        if (idsNotCached.length == 0) {
            return;
        }
        //
        //
        const promises = [];
        idsNotCached.forEach(id => {
            const url = scripts[id];
            promises.push(load.js({ id, url }));
        });
        Promise.all(promises)
            .then((scripts) => {
            scripts.forEach(script => {
                cachedScripts[script.id] = script.url;
            });
            callback();
        });
    }, [scripts]);
}
const load = (function () {
    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img')
    };
})();
function _load(tag) {
    return function (script) {
        return new Promise(function (resolve, reject) {
            var element = document.createElement(tag);
            var parent = document.body;
            var attr = 'src';
            element.onload = function () {
                resolve(script);
            };
            element.onerror = function () {
                element.remove();
                reject(script);
            };
            switch (tag) {
                case 'script':
                    element.async = true;
                    break;
                case 'link':
                    element.type = 'text/css';
                    element.rel = 'stylesheet';
                    attr = 'href';
                    parent = document.head;
            }
            const attr2 = document.createAttribute(attr);
            attr2.value = script.url;
            element.attributes.setNamedItem(attr2);
            parent.appendChild(element);
        });
    };
}
//# sourceMappingURL=useScripts.js.map