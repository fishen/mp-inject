export interface IConfigOptions {
    /**
     * The method name to bind properties, default use onLoad or attached methods.
     * @default 'onLoad' and 'attached'.
     */
    propertiesBinder?: string;
    /**
     * Whether to bind properties in the constructor.
     * @default true
     */
    bindPropertiesInConstructor?: boolean;
}

export const defaultConfigOptions = { bindPropertiesInConstructor: true };
