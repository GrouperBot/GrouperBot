import { RichEmbed, ColorResolvable } from "discord.js";

/**
 * Abstract: Simple embed response builder for success/failure actions
 * 
 * @class ResponseBuilder
 */

export default class ResponseBuilder extends RichEmbed {

    /**
     * @typedef {MessageEmbed} BuilderOptions
     * @property {boolean} [successful=true]
     * @property {ColorResolvable} [successColor=00E676]
     * @property {ColorResolvable} [failColor=DD2C00]
     */


    /**
     * Builds a new response
     * 
     * @param {BuilderOptions} options 
     */
    constructor(options = {}) {
        super(options);

        /**
         * Indicates the status of the response
         * 
         * @type {boolean}
         */
        this.successful = options.successful || true;

        /**
         * Success response color
         * 
         * @type {ColorResolvable}
         */
        this.successColor = options.successColor || "00E676";

        /**
         * Fail response color
         * 
         * @type {ColorResolvable}
         */
        this.failColor = options.failColor || "DD2C00";
    }

    /**
     * Set the status of the response
     * 
     * @param {boolean} successful 
     */
    setState(successful) {
        this.successful = successful;

        return this;
    }
}
