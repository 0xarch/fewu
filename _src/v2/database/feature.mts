import NewPromise from "#util/NewPromise";
import { DataSection } from "./abstract.mjs";

declare type configType = 'none' | 'legacy-v1' | 'modern';

class FeatureSection extends DataSection {
    configType: configType = 'none';
    enabled: string[] = [];
    options: object = {};

    constructor(config: any) {
        let { promise, resolve } = NewPromise.withResolvers();
        super({
            mutable: false
        }, promise);
        let confVersion = 'undetected';
        if (config?.feature?.enable) {
            confVersion = 'legacy-v1';
        }
        if (config['enabled-features']) {
            confVersion = 'modern';
        }

        switch (confVersion) {
            case 'legacy-v1': {
                if (!Array.isArray(config.feature.enable)) {
                    throw new Error(`"feature.enable" detected in configuration but it's not an array!`);
                }
                this.enabled.push(...config.feature.enable);
                for (let [k, v] of Object.entries(config.feature)) {
                    if (k === 'enable') continue;
                    (this.options as any)[k] = v;
                }
                this.configType = 'legacy-v1';
                break;
            }
            case 'modern': {
                if (!Array.isArray(config['enabled-features'])) {
                    throw new Error(`"enabled-features" detected in configuration but it's not an array!`);
                }
                this.enabled.push(...config['enabled-features']);
                Object.assign(this.options, config['feature-option']);
                this.configType = 'modern';
                break;
            }
            case 'undetected': {
                console.log(`[Database/Feature] No feature enabled.`);
                break;
            }
        }

        resolve('feature');
    }
}

export default FeatureSection;