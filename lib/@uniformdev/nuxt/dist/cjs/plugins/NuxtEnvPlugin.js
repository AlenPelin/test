"use strict";
// NOTE: this is a Nuxt-specific plugin, _not_ a Vue plugin
// https://nuxtjs.org/guide/plugins#combined-inject
Object.defineProperty(exports, "__esModule", { value: true });
// The purpose of this plugin is to expose the Nuxt `context.env` property
// to any interested component. This can be more reliable than using `process.env`
// because `process.env` is only (technically) available in Node. And the Webpack DefinePlugin
// that Nuxt uses to provide access to `process.env` in client-side code doesn't
// replace "full" `process.env` usage in modules; it is configured to only
// replace specific `process.env` properties. For instance, if you reference `process.env.SITENAME`
// in your code, the DefinePlugin will replace it in your client bundle as expected. But
// if you only reference `process.env`, it does not get replaced.
function default_1(context, inject) {
    // this will "inject" the `nuxtEnv` property as follows:
    // -> app.$nuxtEnv
    // -> this.$nuxtEnv in vue components
    // -> this.$nuxtEnv in store actions/mutations
    inject('nuxtEnv', context.env);
}
exports.default = default_1;
