import GrouperClient from './GrouperClient';
import  { Message } from 'discord.js';
import { ArgRegex } from "../util/constants";
import GrouperMessage from './GrouperMessage';
import log from '../log';

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

    /**
     * Route a message to a command handler if available
     * 
     * @param {Message} message 
     */
    route(message) {
        if (!message.content.startsWith(this.prefix)) {
            return;
        }

        // Remove the prefix and split it into array, and match first item
        const sCommand = message.content.substr(this.prefix.length).match(ArgRegex)[0];

        const fCommand = this.client.commands.find(f => f.name === sCommand);

        if (fCommand === null) {
            return;
        }

        if (fCommand.developerOnly && !this.client.isDeveloper(message.author.id)) {
            return;
        }

        const m = new GrouperMessage(message);

        m.setCommand(fCommand);

        fCommand.run(m);
    }
}
