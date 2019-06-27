import GrouperClient from "./GrouperClient";
import GrouperMessage from "./GrouperMessage";

export default class GrouperCommand {

    /**
     * @typedef {Object} CommandInfo
     * @property {string} name - Name of the command
     * @property {string} description - Description of the command
     * @property {boolean} [developerOnly = false] - Allow only developer use this command
     */

    /**
     * Create a new base command object
     * 
     * @param {GrouperClient} client - Client object of Grouper
     * @param {CommandInfo} info - Command information
     */
    constructor(client, info) {

        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;

        /**
         * Command name
         * 
         * @type {string}
         */
        this.name = info.name.toLowerCase();

        /**
         * Command description
         * 
         * @type {string}
         */
        this.description = info.description;


        /**
         * Developer only boolean
         * 
         * @type {boolean}
         */
        this.developerOnly = info.developerOnly ? info.developerOnly : false;
    }

    /**
     * Abstraction interface for commands
     * 
     * @abstract
     * 
     * @param {GrouperMessage} message 
     */
    async run(message) {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }

    /**
     * Format command  (prefix + command name)
     * 
     * @return {string}
     */
    toString() {
        return this.client.router.prefix + this.name.toLowerCase();
    }
}