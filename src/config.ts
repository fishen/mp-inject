export interface IConfigOptions {
    /**
     * The method name to bind properties, default use onLoad or attached methods.
     * If you want to bind properties in the constructor, please set the 'bindPropertiesInConstructor' option.
     * @default 'onLoad' and 'attached'.
     */
    propertiesBinder?: string | ((ctor: new (...args: any) => any) => string);
    /**
     * Whether to bind properties in the constructor.
     * @default true
     */
    bindPropertiesInConstructor?: boolean;
}

export const defaultConfigOptions = { bindPropertiesInConstructor: true };
