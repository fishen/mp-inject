export interface IConfigOptions {
    /**
     * The method name to bind properties, default use constructor.
     * @default 'constructor'
     */
    propertiesBinder?: string;
}

export const defaultConfigOptions = {
    propertiesBinder: "constructor",
};
