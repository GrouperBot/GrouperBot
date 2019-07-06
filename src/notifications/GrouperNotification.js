import GrouperClient from "../structures/GrouperClient";
import { Endpoints, RichEmbed } from 'discord.js';

export default class GrouperNotification {
    /**
     * Creates a new store for commands
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;
    }

    /**
     * Abstract format handler expected to be implemented by derived classes
     * 
     * @abstract
     * 
     * @param {*} data - Event data
     */
    format(data) {
        throw new Error(`${this.constructor.name} doesn't have a format() method.`);
    }
}