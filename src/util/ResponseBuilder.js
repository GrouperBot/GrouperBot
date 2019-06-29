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
     * @property {ColorResolvable} [successColor=00FFFF]
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
        this.successColor = options.successColor || "#00FFFF";

        /**
         * Fail response color
         * 
         * @type {ColorResolvable}
         */
        this.failColor = options.failColor || "#DD2C00";

        // setColor passes through color resolver
        this.setColor(this.successful ? this.successColor : this.failColor);
    }


    /**
     * Creates a field with a trailing \n for pleasant spacing
     * 
     * @param {string} name 
     * @param {string} value 
     */
    addHelpField(name, value) {
        return this.addField(name, `${value}\n\u200B`, false);
    }

    /**
     * Set the status of the response
     * 
     * @param {boolean} successful 
     */
    setState(successful) {
        this.successful = successful;

        this.setColor(this.successful ? this.successColor : this.failColor);

        if (!this.successColor)
            this.setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cross-mark_274c.png');
            
        return this;
    }

    /**
     * Sets the thumbnail for usage commands
     */
    isUsage() {
        return this.setThumbnail('https://i.imgur.com/yXeRZXs.png');
    }
}
