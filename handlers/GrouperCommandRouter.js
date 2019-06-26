import GrouperClient from '../structures/GrouperClient';

export default class GrouperCommandRouter {

    /**
     * @typedef {Object} RouterOption
     * @property {string} prefix - Command prefix
     */

    /**
     * Creates a new router for commands
     * 
     * @param {GrouperClient} client 
     * @param {RouterOption} options
     */
    constructor(client, options) {
        
        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;

        /**
         * Command prefix
         * 
         * @type {string}
         */
        this.prefix = options.prefix;
    }

    hook() {
        // TODO: implementation
    }
}
