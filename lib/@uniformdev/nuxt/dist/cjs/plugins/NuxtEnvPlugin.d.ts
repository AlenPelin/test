export default function (context: any, inject: any): void;
export interface NuxtEnvPluginProperties {
    env: {
        [key: string]: any;
    };
}
declare module 'vue/types/vue' {
    interface Vue {
        $nuxtEnv: NuxtEnvPluginProperties;
    }
}
