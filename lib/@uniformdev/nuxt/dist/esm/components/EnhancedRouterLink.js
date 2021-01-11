import { replace, trim, parseUniformConfig, } from '@uniformdev/common';
import { getPageUrl } from '@uniformdev/common-client';
export var EnhancedRouterLink = {
    name: 'EnhancedRouterLink',
    props: {
        enableLinkPrefetch: {
            type: Boolean,
            default: true,
        },
        href: {
            type: String,
        },
        item: {
            type: Object,
        },
        runtimeConfig: {
            type: Object,
        },
    },
    render: function (createElement) {
        // For whatever reason, this.$children is an empty array here,
        // even with components declared as children of this component... weird.
        // Sounds like this.$scopedSlots is the preferred option when using `render` functions
        // and will be more prominent in Vue 3:
        // https://vuejs.org/v2/api/#vm-scopedSlots
        var children = this.$scopedSlots.default();
        var resolvedUrl = this.resolveUrl();
        // If the resolved url "appears" to be an external link, then we assume the router
        // shouldn't handle it and render a normal `a` tag.
        if (resolvedUrl &&
            (resolvedUrl.toLowerCase().startsWith('http') || resolvedUrl.toLowerCase().startsWith('//'))) {
            // router-link is a global component that is added by `vue-router`
            return createElement('a', { attrs: { href: resolvedUrl } }, children);
        }
        var value = trim(resolvedUrl, '/');
        var link = replace("/" + value + "/", '//', '/');
        return createElement('router-link', { props: { to: link } }, children);
    },
    methods: {
        resolveUrl: function () {
            return this.href || (this.item && this.item.url);
        },
    },
    head: function () {
        // The `process.env` object doesn't get string-replaced by DefinePlugin, only individual
        // properties of `process.env`. For example, if our code was directly referencing `process.env.SITENAME`,
        // it would be replaced by the DefinePlugin at build time.
        // So, we need to rely on the `NuxtEnvPlugin` that adds `$nuxtEnv` to component instances and gives
        // us access to values from the `env` property in `nuxt.config.js`.
        var env = parseUniformConfig(Object.assign({}, process.env, this.$nuxtEnv, this.runtimeConfig));
        if (this.enableLinkPrefetch || (env && env.UNIFORM_OPTIONS_PREFETCH_LINKS)) {
            var resolvedUrl = this.resolveUrl();
            var prefetchPageUrl = getPageUrl(resolvedUrl, 'page', env);
            // const prefetchDatasourcesUrl = getPageUrl(resolvedUrl, 'ds', env);
            return {
                link: [
                    {
                        rel: 'preload',
                        crossOrigin: 'anonymous',
                        href: prefetchPageUrl,
                        as: 'fetch',
                        key: prefetchPageUrl,
                        // `hid` is a unique identifier used by `vue-meta` to prevent
                        // duplicate tags from being added to head.
                        hid: prefetchPageUrl,
                    },
                ],
            };
        }
        return {};
    },
};
