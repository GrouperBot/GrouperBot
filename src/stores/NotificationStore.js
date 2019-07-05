import { Collection } from "discord.js";
import GrouperClient from "../structures/GrouperClient";

export default class NotificationStore extends Collection {
    /**
     * Creates a new store for commands
     * 
     * @param {GrouperClient} client 
     * @param {String} guild - Guild snowflake
     * @param {String} channel - Channel slowflake
     */
    constructor(client, guild, channel) {
        super();

        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;

        /**
         * Client's support guild snowflake
         * 
         * @type {String}
         */
        this.supportguild = guild;

        /** Client's support channel snowflake
         * 
         * @type {String}
         */
        this.supportchannel = channel;
    }

    /**
     * Inserts into collection if it does not exist already
     * 
     * @param {string} id - Data ID 
     * @param {*} data - Data
     * 
     * @return {*}
     */
    add(id, data) {
        const existing = this.has(id);

        if (existing) {
            return existing;
        }

        this.set(id, data)
    }
}